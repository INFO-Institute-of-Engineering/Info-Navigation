import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { CampusLocation } from '../types/campus'
import type { Coordinates, WalkingRoute } from '../types/navigation'
import {
  CAMPUS_CENTER,
  CAMPUS_BOUNDS,
  CAMPUS_BOUNDARY_POLYGON,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
} from '../data/campusBoundary'
import { campusPathEdges, campusPathNodes } from '../data/campusPaths'

interface MapViewProps {
  locations: CampusLocation[]
  selectedDestination: CampusLocation | null
  onSelectDestination: (dest: CampusLocation) => void
  userCoords: Coordinates | null
  isManualLocation?: boolean
  currentRoute: WalkingRoute | null
  isSatellite: boolean
  isTilted: boolean
  onMapClick?: (coords: { latitude: number; longitude: number }) => void
  mapRefOut?: React.MutableRefObject<L.Map | null>
}

export const MapView: React.FC<MapViewProps> = ({
  locations,
  selectedDestination,
  onSelectDestination,
  userCoords,
  isManualLocation,
  currentRoute,
  isSatellite,
  isTilted,
  onMapClick,
  mapRefOut,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const baseLayerGroupRef = useRef<L.LayerGroup | null>(null)
  const boundaryLayerRef = useRef<L.Polygon | null>(null)
  const walkwayLayerGroupRef = useRef<L.LayerGroup | null>(null)
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null)
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const userAccuracyCircleRef = useRef<L.Circle | null>(null)

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return

    const southWest = L.latLng(CAMPUS_BOUNDS[0][0] - 0.003, CAMPUS_BOUNDS[0][1] - 0.003)
    const northEast = L.latLng(CAMPUS_BOUNDS[1][0] + 0.003, CAMPUS_BOUNDS[1][1] + 0.003)
    const campusBounds = L.latLngBounds(southWest, northEast)

    const map = L.map(containerRef.current, {
      center: CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 12,
      maxZoom: MAX_ZOOM,
      zoomControl: false,
      attributionControl: true,
    })

    // Custom positioned zoom control on desktop/mobile
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map)

    baseLayerGroupRef.current = L.layerGroup().addTo(map)
    boundaryLayerRef.current = L.polygon(CAMPUS_BOUNDARY_POLYGON, {
      color: '#3b82f6',
      weight: 2.5,
      opacity: 0.85,
      fillColor: '#3b82f6',
      fillOpacity: 0.06,
      dashArray: '6, 6',
    }).addTo(map)

    walkwayLayerGroupRef.current = L.layerGroup().addTo(map)
    markersLayerGroupRef.current = L.layerGroup().addTo(map)
    routeLayerGroupRef.current = L.layerGroup().addTo(map)

    map.on('click', (e) => {
      if (onMapClick) {
        onMapClick({ latitude: e.latlng.lat, longitude: e.latlng.lng })
      }
    })

    mapInstanceRef.current = map
    if (mapRefOut) {
      mapRefOut.current = map
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
      if (mapRefOut) {
        mapRefOut.current = null
      }
    }
  }, [mapRefOut, onMapClick])

  // 2. Handle Base Tile Layers (Real Satellite vs Modern Street)
  useEffect(() => {
    const map = mapInstanceRef.current
    const baseGroup = baseLayerGroupRef.current
    if (!map || !baseGroup) return

    baseGroup.clearLayers()

    if (isSatellite) {
      // High-resolution Esri World Imagery
      const satelliteTiles = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: MAX_ZOOM,
          maxNativeZoom: 19,
        }
      )

      // Overlay transparent labels for campus streets & places
      const labelsTiles = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '',
          maxZoom: MAX_ZOOM,
          opacity: 0.75,
        }
      )

      baseGroup.addLayer(satelliteTiles)
      baseGroup.addLayer(labelsTiles)
    } else {
      // CartoDB Voyager / Streets
      const streetTiles = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: MAX_ZOOM,
          subdomains: 'abcd',
        }
      )
      baseGroup.addLayer(streetTiles)
    }
  }, [isSatellite])

  // 3. Render Campus Pathways (High-visibility solid blue routes matching satellite blueprint)
  useEffect(() => {
    const walkwayGroup = walkwayLayerGroupRef.current
    if (!walkwayGroup) return

    walkwayGroup.clearLayers()

    const nodeMap = new Map()
    campusPathNodes.forEach((n) => nodeMap.set(n.id, n))

    campusPathEdges.forEach((edge) => {
      if (edge.isIndoor) return // Skip indoor corridor connections from outdoor map

      const from = nodeMap.get(edge.fromNodeId)
      const to = nodeMap.get(edge.toNodeId)
      if (from && to) {
        // Subtle dark outline/casing for contrast against bright pavement and trees
        const casing = L.polyline(
          [
            [from.latitude, from.longitude],
            [to.latitude, to.longitude],
          ],
          {
            color: '#0f172a',
            weight: 5.5,
            opacity: 0.6,
            lineCap: 'round',
            lineJoin: 'round',
          }
        )
        // Solid vivid royal blue route matching blueprint
        const core = L.polyline(
          [
            [from.latitude, from.longitude],
            [to.latitude, to.longitude],
          ],
          {
            color: '#2563eb',
            weight: 3.5,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }
        )
        walkwayGroup.addLayer(casing)
        walkwayGroup.addLayer(core)
      }
    })
  }, [isSatellite])

// Helper to get distinctive, clear letter badges for each campus block/landmark
const getPlaceBadge = (loc: CampusLocation): string => {
  if (loc.id === 'b-block') return 'B'
  if (loc.id === 'c-block') return 'C'
  if (loc.id === 'd-block') return 'D'
  if (loc.buildingInfo?.code?.startsWith('BLOCK-')) {
    return loc.buildingInfo.code.replace('BLOCK-', '')
  }
  if (loc.id === 'office-room') return 'ADM'
  if (loc.id === 'library') return 'LIB'
  if (loc.id === 'mess') return 'MESS'
  if (loc.id === 'canteen') return 'CAFE'
  if (loc.id === 'boys-hostel') return 'BH'
  if (loc.id === 'girls-hostel') return 'GH'
  if (loc.id === 'parking') return 'P'
  if (loc.id === 'auditorium') return 'AUD'
  if (loc.id === 'main-entrance') return 'GATE'
  if (loc.id === 'basketball') return 'BB'
  if (loc.id === 'volleyball') return 'VB'
  if (loc.id === 'playground') return 'PLAY'
  return loc.buildingInfo?.code?.split('-')[0] || loc.name.charAt(0)
}

// Clean, high-visibility short name for permanent map chips
const getPlaceShortName = (loc: CampusLocation): string => {
  if (loc.id === 'b-block') return 'B - Block'
  if (loc.id === 'c-block') return 'C - Block'
  if (loc.id === 'd-block') return 'D - Block'
  if (loc.id === 'office-room') return 'Admin Office'
  if (loc.id === 'library') return 'Library'
  if (loc.id === 'mess') return 'Dining Mess'
  if (loc.id === 'canteen') return 'Canteen'
  if (loc.id === 'boys-hostel') return 'Boys Hostel'
  if (loc.id === 'girls-hostel') return 'Girls Hostel'
  if (loc.id === 'parking') return 'Parking Bays'
  if (loc.id === 'auditorium') return 'Auditorium'
  if (loc.id === 'main-entrance') return 'Main Entrance'
  if (loc.id === 'basketball') return 'Basketball'
  if (loc.id === 'volleyball') return 'Volleyball'
  if (loc.id === 'playground') return 'Play Ground'
  return loc.name.split('(')[0].trim()
}

  // 4. Render Building Destination Markers
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersGroup = markersLayerGroupRef.current
    if (!map || !markersGroup) return

    markersGroup.clearLayers()

    locations.forEach((loc) => {
      const isSelected = selectedDestination?.id === loc.id
      const pinColor = loc.color || '#2563eb'
      const badge = getPlaceBadge(loc)
      const shortName = getPlaceShortName(loc)

      // Clean, elegant pin with very small, subtle micro-beacon ring
      const iconHtml = `
        <div class="campus-marker-wrapper ${isSelected ? 'place-selected-active' : ''}">
          ${isSelected ? '<div class="micro-beacon-ring"></div>' : ''}
          <div class="campus-marker-pin">
            <div style="
              background: ${isSelected ? '#ffffff' : pinColor};
              border: 2px solid ${isSelected ? pinColor : '#ffffff'};
              color: ${isSelected ? pinColor : '#ffffff'};
              width: ${isSelected ? '32px' : '28px'};
              height: ${isSelected ? '32px' : '28px'};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 3px 10px rgba(0,0,0,0.45);
              transition: all 0.2s ease;
            ">
              <span style="
                transform: rotate(45deg);
                font-size: ${badge.length > 2 ? '9px' : '11px'};
                font-weight: 800;
                font-family: 'Inter', sans-serif;
                letter-spacing: -0.02em;
              ">
                ${badge}
              </span>
            </div>
          </div>
          <div class="place-label-chip ${isSelected ? 'is-selected-label' : ''}">
            ${shortName}
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        className: 'campus-custom-marker',
        html: iconHtml,
        iconSize: [100, 56],
        iconAnchor: [50, 28],
      })

      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      })

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        onSelectDestination(loc)
      })

      markersGroup.addLayer(marker)
    })
  }, [locations, selectedDestination, onSelectDestination])

  // 5. Render Active Walking Route
  useEffect(() => {
    const routeGroup = routeLayerGroupRef.current
    if (!routeGroup) return

    routeGroup.clearLayers()

    if (!currentRoute || currentRoute.pathCoordinates.length < 2) return

    // Route background glow line
    const glowLine = L.polyline(currentRoute.pathCoordinates, {
      color: '#0284c7',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    })

    // Route core active blue line
    const coreLine = L.polyline(currentRoute.pathCoordinates, {
      color: '#1a73e8',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    })

    // Dashed pedestrian walking dots overlay
    const dashLine = L.polyline(currentRoute.pathCoordinates, {
      color: '#ffffff',
      weight: 2,
      opacity: 0.8,
      dashArray: '4, 10',
      lineCap: 'round',
    })

    routeGroup.addLayer(glowLine)
    routeGroup.addLayer(coreLine)
    routeGroup.addLayer(dashLine)

    // Destination flag icon at the entrance
    const lastCoord = currentRoute.pathCoordinates[currentRoute.pathCoordinates.length - 1]
    const destIcon = L.divIcon({
      className: 'dest-flag-icon',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background: #ef4444;
          border: 2px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.5);
          color: white;
          font-size: 14px;
        ">
          🏁
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })

    const destMarker = L.marker([lastCoord[0], lastCoord[1]], { icon: destIcon })
    routeGroup.addLayer(destMarker)
  }, [currentRoute])

  // 6. Render Real GPS User Location Marker & Accuracy Halo
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (!userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.remove()
        userAccuracyCircleRef.current = null
      }
      return
    }

    const { latitude, longitude, accuracy, heading } = userCoords
    const latLng = L.latLng(latitude, longitude)

    // Accuracy Circle (hide if manual calibration pin)
    if (!isManualLocation && accuracy && accuracy > 0) {
      if (!userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current = L.circle(latLng, {
          radius: Math.min(accuracy, 80),
          color: '#1a73e8',
          weight: 1,
          opacity: 0.4,
          fillColor: '#1a73e8',
          fillOpacity: 0.12,
        }).addTo(map)
      } else {
        userAccuracyCircleRef.current.setLatLng(latLng)
        userAccuracyCircleRef.current.setRadius(Math.min(accuracy, 80))
      }
    } else if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.remove()
      userAccuracyCircleRef.current = null
    }

    // User Location Dot + Pulse Ring + Heading Cone
    const headingConeHtml =
      heading !== null && heading !== undefined
        ? `<div class="gps-heading-cone" style="transform: rotate(${heading}deg);"></div>`
        : ''

    const userHtml = isManualLocation
      ? `
        <div style="position: relative; width: 28px; height: 28px; display:flex; align-items:center; justify-content:center;">
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #10b981;
            border: 3px solid #ffffff;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.8), 0 2px 6px rgba(0,0,0,0.4);
          "></div>
          <div style="
            position: absolute;
            top: -24px;
            left: 50%;
            transform: translateX(-50%);
            background: #064e3b;
            color: #ecfdf5;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border: 1px solid #10b981;
          ">
            📍 My Location
          </div>
        </div>
      `
      : `
        <div style="position: relative; width: 24px; height: 24px;">
          <div class="gps-pulse-ring"></div>
          ${headingConeHtml}
          <div class="gps-dot"></div>
        </div>
      `

    const userIcon = L.divIcon({
      className: 'gps-user-marker-container',
      html: userHtml,
      iconSize: isManualLocation ? [28, 28] : [24, 24],
      iconAnchor: isManualLocation ? [14, 14] : [12, 12],
    })

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(latLng, {
        icon: userIcon,
        zIndexOffset: 2000,
      }).addTo(map)
    } else {
      userMarkerRef.current.setLatLng(latLng)
      userMarkerRef.current.setIcon(userIcon)
    }
  }, [userCoords, isManualLocation])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={containerRef}
        className={`w-full h-full ${isTilted ? 'tilted-map-pane' : 'normal-map-pane'}`}
      />
    </div>
  )
}
