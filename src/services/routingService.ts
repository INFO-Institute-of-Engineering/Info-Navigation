import type { Coordinates, PathNode, WalkingRoute, WalkingStep } from '../types/navigation'
import type { CampusLocation } from '../types/campus'
import { getCampusNetworkWithDistances } from '../data/campusPaths'
import {
  calculateHaversineDistance,
  calculateBearing,
  getManeuverDirection,
  distanceToSegment,
} from '../utils/distance'

// Average human pedestrian walking speed: ~1.25 meters per second (4.5 km/h)
export const PEDESTRIAN_SPEED_MPS = 1.25

export class RoutingService {
  /**
   * Calculates a verified walking route from start coordinates to destination.
   */
  public static calculateWalkingRoute(
    start: Coordinates,
    destination: CampusLocation
  ): WalkingRoute | null {
    const { nodes, nodeMap, adjacencyList } = getCampusNetworkWithDistances()

    // 1. Determine destination target node (use dedicated entrance if configured)
    const destLat = destination.entranceLatitude ?? destination.latitude
    const destLng = destination.entranceLongitude ?? destination.longitude

    let targetNode: PathNode | null = nodes.find((n) => n.locationId === destination.id) ?? null
    if (!targetNode) {
      // Find nearest node to destination entrance
      targetNode = this.findNearestNode({ latitude: destLat, longitude: destLng }, nodes)
    }

    if (!targetNode) {
      console.warn('Could not locate campus network node for destination', destination.name)
      return null
    }

    // 2. Find closest campus network node to user's starting GPS
    const startNode = this.findNearestNode(start, nodes)
    if (!startNode) {
      console.warn('Could not locate start node for user location')
      return null
    }

    // 3. Run Dijkstra pathfinding on pedestrian network
    const shortestPathNodes = this.dijkstra(startNode.id, targetNode.id, adjacencyList, nodeMap)
    if (!shortestPathNodes || shortestPathNodes.length === 0) {
      console.warn('No verified walking path found between nodes', startNode.id, targetNode.id)
      return null
    }

    // 4. Build coordinate sequence
    const pathCoords: Array<[number, number]> = []

    const distToStartNode = calculateHaversineDistance(start, {
      latitude: startNode.latitude,
      longitude: startNode.longitude,
    })

    // If user's starting point is noticeably away from network node, include start; otherwise snap directly to the walkway
    if (distToStartNode > 8) {
      pathCoords.push([start.latitude, start.longitude])
    }

    // Include path network nodes
    shortestPathNodes.forEach((node) => {
      pathCoords.push([node.latitude, node.longitude])
    })

    // If target node is slightly offset from actual entrance portico, append entrance
    const lastNode = shortestPathNodes[shortestPathNodes.length - 1]
    if (
      destination.entranceLatitude &&
      destination.entranceLongitude &&
      lastNode &&
      (Math.abs(lastNode.latitude - destination.entranceLatitude) > 0.00005 ||
        Math.abs(lastNode.longitude - destination.entranceLongitude) > 0.00005)
    ) {
      pathCoords.push([destination.entranceLatitude, destination.entranceLongitude])
    }

    // 5. Calculate cumulative distance and duration
    let totalDistance = 0
    for (let i = 0; i < pathCoords.length - 1; i++) {
      const p1 = { latitude: pathCoords[i][0], longitude: pathCoords[i][1] }
      const p2 = { latitude: pathCoords[i + 1][0], longitude: pathCoords[i + 1][1] }
      totalDistance += calculateHaversineDistance(p1, p2)
    }

    const estimatedDurationSeconds = Math.round(totalDistance / PEDESTRIAN_SPEED_MPS)

    // 6. Generate human-readable walking maneuver steps
    const steps = this.generateWalkingSteps(pathCoords, shortestPathNodes, destination)

    return {
      id: `route_${Date.now()}_${destination.id}`,
      startCoords: start,
      destination,
      pathCoordinates: pathCoords,
      nodes: shortestPathNodes,
      edges: [],
      totalDistanceMeters: totalDistance,
      estimatedDurationSeconds,
      steps,
      source: 'verified-campus-network',
    }
  }

  /**
   * Finds the nearest network node to given coordinates using Haversine distance.
   */
  public static findNearestNode(point: Coordinates, nodes: PathNode[]): PathNode | null {
    let nearest: PathNode | null = null
    let minDistance = Infinity

    nodes.forEach((node) => {
      const d = calculateHaversineDistance(point, {
        latitude: node.latitude,
        longitude: node.longitude,
      })
      if (d < minDistance) {
        minDistance = d
        nearest = node
      }
    })

    return nearest
  }

  /**
   * Dijkstra shortest path algorithm on the pedestrian adjacency graph.
   */
  private static dijkstra(
    startNodeId: string,
    targetNodeId: string,
    adjacencyList: Map<string, Array<{ targetNodeId: string; distance: number }>>,
    nodeMap: Map<string, PathNode>
  ): PathNode[] | null {
    if (startNodeId === targetNodeId) {
      const node = nodeMap.get(startNodeId)
      return node ? [node] : null
    }

    const distances = new Map<string, number>()
    const previous = new Map<string, string | null>()
    const unvisited = new Set<string>()

    nodeMap.forEach((_, id) => {
      distances.set(id, Infinity)
      previous.set(id, null)
      unvisited.add(id)
    })

    distances.set(startNodeId, 0)

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let currentId: string | null = null
      let smallestDist = Infinity

      unvisited.forEach((id) => {
        const dist = distances.get(id) ?? Infinity
        if (dist < smallestDist) {
          smallestDist = dist
          currentId = id
        }
      })

      if (currentId === null || smallestDist === Infinity) break
      if (currentId === targetNodeId) break

      unvisited.delete(currentId)

      const neighbors = adjacencyList.get(currentId) || []
      neighbors.forEach((neighbor) => {
        if (!unvisited.has(neighbor.targetNodeId)) return

        const currentDist = distances.get(currentId!) ?? Infinity
        const newDist = currentDist + neighbor.distance

        if (newDist < (distances.get(neighbor.targetNodeId) ?? Infinity)) {
          distances.set(neighbor.targetNodeId, newDist)
          previous.set(neighbor.targetNodeId, currentId)
        }
      })
    }

    // Reconstruct path
    const path: PathNode[] = []
    let curr: string | null = targetNodeId

    while (curr) {
      const node = nodeMap.get(curr)
      if (node) path.unshift(node)
      curr = previous.get(curr) ?? null
    }

    return path.length > 0 && path[0].id === startNodeId ? path : null
  }

  /**
   * Generates pedestrian turn-by-turn instructions with realistic bearings.
   */
  private static generateWalkingSteps(
    pathCoords: Array<[number, number]>,
    nodes: PathNode[],
    destination: CampusLocation
  ): WalkingStep[] {
    const steps: WalkingStep[] = []

    if (pathCoords.length < 2) return steps

    let prevBearing = calculateBearing(
      { latitude: pathCoords[0][0], longitude: pathCoords[0][1] },
      { latitude: pathCoords[1][0], longitude: pathCoords[1][1] }
    )

    // First step: Initial heading
    const firstDist = calculateHaversineDistance(
      { latitude: pathCoords[0][0], longitude: pathCoords[0][1] },
      { latitude: pathCoords[1][0], longitude: pathCoords[1][1] }
    )

    const firstNodeName = nodes[0]?.name || 'Campus Walkway'
    steps.push({
      instruction: `Head towards ${firstNodeName}`,
      distanceMeters: firstDist,
      durationSeconds: Math.round(firstDist / PEDESTRIAN_SPEED_MPS),
      fromNodeName: 'Your Location',
      toNodeName: firstNodeName,
      coordinate: { latitude: pathCoords[0][0], longitude: pathCoords[0][1] },
    })

    for (let i = 1; i < pathCoords.length - 1; i++) {
      const p1 = { latitude: pathCoords[i][0], longitude: pathCoords[i][1] }
      const p2 = { latitude: pathCoords[i + 1][0], longitude: pathCoords[i + 1][1] }

      const segDist = calculateHaversineDistance(p1, p2)
      const currentBearing = calculateBearing(p1, p2)
      const turnAction = getManeuverDirection(prevBearing, currentBearing)

      const targetName =
        i === pathCoords.length - 2
          ? destination.name
          : nodes[i]?.name || 'Campus Walkway'

      const instruction =
        turnAction === 'Continue straight'
          ? `Continue straight towards ${targetName}`
          : `${turnAction} towards ${targetName}`

      steps.push({
        instruction,
        distanceMeters: segDist,
        durationSeconds: Math.round(segDist / PEDESTRIAN_SPEED_MPS),
        fromNodeName: nodes[i - 1]?.name || 'Walkway',
        toNodeName: targetName,
        coordinate: p1,
      })

      prevBearing = currentBearing
    }

    // Final arrival step
    const lastCoord = pathCoords[pathCoords.length - 1]
    steps.push({
      instruction: `Arrive at ${destination.name}`,
      distanceMeters: 0,
      durationSeconds: 0,
      fromNodeName: destination.name,
      toNodeName: destination.name,
      coordinate: { latitude: lastCoord[0], longitude: lastCoord[1] },
    })

    return steps
  }

  /**
   * Checks if user has deviated from the walking route (off-route tolerance > 25 meters).
   */
  public static checkRouteDeviation(
    userLocation: Coordinates,
    route: WalkingRoute,
    toleranceMeters: number = 25
  ): { isOffRoute: boolean; minDistanceToRoute: number } {
    let minDistance = Infinity

    for (let i = 0; i < route.pathCoordinates.length - 1; i++) {
      const v = {
        latitude: route.pathCoordinates[i][0],
        longitude: route.pathCoordinates[i][1],
      }
      const w = {
        latitude: route.pathCoordinates[i + 1][0],
        longitude: route.pathCoordinates[i + 1][1],
      }

      const dist = distanceToSegment(userLocation, v, w)
      if (dist < minDistance) {
        minDistance = dist
      }
    }

    return {
      isOffRoute: minDistance > toleranceMeters,
      minDistanceToRoute: minDistance,
    }
  }
}
