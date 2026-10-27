# INFO Institute of Engineering — Live GPS Campus Navigation

A complete, mobile-first, Google Maps-inspired campus navigation website built specifically for **INFO Institute of Engineering, Coimbatore, Tamil Nadu, India**.

---

## 🏛️ Campus Overview

- **Institution**: INFO Institute of Engineering
- **Location**: Karuvalur - Kovilpalayam Road, Coimbatore, Tamil Nadu 641107, India
- **Map Center**: `11.127350° N, 77.038850° E`
- **Purpose**: Dedicated pedestrian walking navigation strictly inside the verified college campus.

---

## 🚀 Key Features

### 1. High-Resolution Interactive Satellite Map
- **Satellite Provider**: Legitimate high-resolution satellite imagery from **Esri World Imagery** with layered place and boundary references.
- **Street Map Mode**: High-contrast **CartoDB Voyager** vector street tiles for clear daytime readability.
- **3D Tilted Perspective Mode**: Interactive camera tilt providing a 2.5D perspective viewing angle of campus buildings.
- **Campus Boundary**: Restricts map bounds to the verified perimeter polygon, preventing arbitrary navigation outside college premises.

### 2. Verified Campus Destinations
All 17 official buildings and facilities from the campus infrastructure blueprint have verified coordinates and dedicated entrance locations:
- **Academic Blocks**:
  - `B - BLOCK (Central Academic)` — Computer Science, IT, smart lecture halls
  - `C - BLOCK (Engineering Labs)` — ECE, VLSI, AI/ML, Robotics & IoT labs
  - `D - BLOCK (Specialized Labs)` — First-year labs, Physics, Chemistry, CAD/CAM
  - `E - BLOCK (Academic Wing)` — Mechanical & Civil engineering, Drawing halls
- **Administration & Facilities**:
  - `Office Area (Administrative Block)` — Principal, Dean, Accounts, Admissions & Exam Cell
  - `College Auditorium (A - Block)` — 1,200-seater air-conditioned convention hall
  - `Observatory & Library Block` — Central digital library, journals, observation deck
  - `Main Entrance & Security Arch` — Karuvalur - Kovilpalayam Road entrance gate
  - `Campus Parking Area` — Bus bay, faculty and student vehicle parking
- **Hostels & Dining**:
  - `Boys Hostel Complex` (4 storeys) & `Girls Hostel Complex` (4 storeys, secure courtyard)
  - `Boys Dining Hall` & `Girls Dining Hall`
  - `Canteen & Food Court`
- **Sports Facilities**:
  - `Basketball Court` (Synthetic court)
  - `Volleyball Court`
  - `College Athletic Playground` (Cricket pitch, football turf, running track)

### 3. Pedestrian-Only Walking Routing
- **Graph-Based Walking Network**: Mapped along verified campus walkways, paved driveways, courtyards, and portico entrances.
- **Dijkstra Pathfinding Algorithm**: Computes the shortest walking route through actual walkways—never routing through buildings, walls, or obstacles.
- **Accurate Distance & Time**: Real Haversine walking distance (e.g., `180 m`) and estimated walking time based on human pedestrian speed (~1.25 m/s).

### 4. Real Browser GPS Location & Live Navigation
- **HTML5 Geolocation API**: Continuous tracking via `navigator.geolocation.watchPosition` with high accuracy.
- **Pulsing GPS Marker**: Visual blue dot with pulsing accuracy halo circle and direction cone.
- **Campus Geofence**: Automatically detects whether the student is inside or outside the verified college campus boundary.
- **Turn-by-Turn Guidance HUD**: Displays step maneuvers, remaining distance, walking duration, and progress bar.
- **Route Deviation & Rerouting**: Detects when the user deviates >25m from the path and automatically recalculates the route.

### 5. Campus Blueprint Viewer & Mobile QR Sharing
- **Infrastructure Blueprint Modal**: High-res view of the official campus layout with interactive building selectors.
- **QR Code Link**: Desktop users can scan the on-screen QR code with their mobile camera to open live GPS navigation directly on their phone.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 6, PostCSS, Autoprefixer
- **Styling**: TailwindCSS 3 with custom Google Maps design tokens and glassmorphism
- **Mapping Engine**: Leaflet 1.9 with custom tile layers, DivIcons, and SVG pins
- **Icons**: Lucide React
- **QR Code Generator**: QRCode

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```
The compiled bundle will be output in the `dist/` directory.
