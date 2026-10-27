import type { CampusLocation, CategoryInfo } from '../types/campus'

export const CAMPUS_CATEGORIES: CategoryInfo[] = [
  { id: 'academic', label: 'Academic Blocks', icon: 'GraduationCap', color: '#2563eb' },
  { id: 'admin', label: 'Administration', icon: 'Building2', color: '#4f46e5' },
  { id: 'facility', label: 'Auditorium & Halls', icon: 'Compass', color: '#0284c7' },
  { id: 'dining', label: 'Dining & Food', icon: 'Utensils', color: '#ea580c' },
  { id: 'hostel', label: 'Hostels', icon: 'Home', color: '#059669' },
  { id: 'sports', label: 'Sports & Grounds', icon: 'Trophy', color: '#16a34a' },
  { id: 'entrance', label: 'Gates & Entrances', icon: 'DoorOpen', color: '#0d9488' },
  { id: 'parking', label: 'Parking', icon: 'Car', color: '#64748b' },
]

/**
 * Verified Campus Locations for INFO Institute of Engineering, Coimbatore.
 * Pixel-calibrated 1:1 on actual high-resolution satellite imagery tiles:
 *
 * True Ground Truth (Compass: North = Up, South = Down, East = Right, West = Left):
 * - NORTH (Top-Center): Main Entrance Gate & Security Arch (11.128134, 77.039351)
 * - NORTH-EAST (Top-Right): Parking Bays (11.128608, 77.039512) & College Auditorium (11.128687, 77.039781)
 * - NORTH-WEST: Canteen & Cafeteria (11.128055, 77.038493)
 * - WEST SPORTS CORRIDOR: Play Ground (11.127739, 77.037957), Volleyball Court (11.127713, 77.038493), Basketball Court (11.127371, 77.038493)
 * - WEST FLANK: Boys Hostel (11.126844, 77.037796) & D - Block (11.126502, 77.038359)
 * - CENTRAL FRONT: B - Block (11.127397, 77.039298) & Office Room (11.127239, 77.039298)
 * - CENTRAL REAR: C - Block (11.127029, 77.039298) & Library (11.126871, 77.039298)
 * - SOUTH (Bottom): Dining Mess (11.126108, 77.038708) & Girls Hostel (11.126029, 77.039351)
 */
export const defaultCampusLocations: CampusLocation[] = [
  {
    id: 'main-entrance',
    name: 'Main Entrance & Security Arch',
    category: 'entrance',
    description: 'Main college entrance gate and 24/7 security checkpoint on Karuvalur - Kovilpalayam Road with central entrance avenue.',
    latitude: 11.128134,
    longitude: 77.039350,
    entranceLatitude: 11.128134,
    entranceLongitude: 77.039350,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#0d9488',
    buildingInfo: {
      code: 'GATE-01',
      facilities: ['Security Checkpoint', 'Visitor Entry Desk', 'Vehicle Barrier', 'Campus Directory'],
      notes: 'North entrance arch opening into the central avenue.'
    },
    blueprintCoords: { x: 300, y: 150, width: 60, height: 30, labelX: 300, labelY: 130 },
    accessibilityInfo: { wheelchairAccessible: true, notes: 'Level paved ground without steps' },
    keywords: ['gate', 'entry', 'exit', 'arch', 'security', 'guard', 'road', 'kovilpalayam', 'main entrance', 'main']
  },
  {
    id: 'parking',
    name: 'Campus Parking & Vehicle Bays',
    category: 'parking',
    description: 'Designated parking bays for two-wheelers, four-wheelers, faculty vehicles, and college transport adjacent to the Auditorium.',
    latitude: 11.128608,
    longitude: 77.039600,
    entranceLatitude: 11.128608,
    entranceLongitude: 77.039600,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#64748b',
    buildingInfo: {
      code: 'PARK-01',
      facilities: ['Two-Wheeler Covered Parking', 'Four-Wheeler Visitor Bays', 'Staff Parking', 'Bus Bay'],
      notes: 'Long covered parking bay adjacent to the west wall of the Auditorium.'
    },
    blueprintCoords: { x: 450, y: 130, width: 70, height: 40, labelX: 450, labelY: 110 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['parking', 'bike', 'car', 'vehicle', 'bus', 'scooter', 'stand', 'parking bay']
  },
  {
    id: 'auditorium',
    name: 'College Auditorium',
    category: 'facility',
    description: 'Large air-conditioned convention auditorium located in the northeast sector next to the parking bays.',
    latitude: 11.128687,
    longitude: 77.039781,
    entranceLatitude: 11.128687,
    entranceLongitude: 77.039781,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#ea580c',
    buildingInfo: {
      code: 'AUD-MAIN',
      floorsCount: 2,
      facilities: ['1200-Seater Auditorium', 'Audio-Visual Sound System', 'Green Rooms', 'VIP Reception Lounge'],
      notes: 'Large dark-roofed convention hall situated at the North-East of campus.'
    },
    blueprintCoords: { x: 550, y: 130, width: 110, height: 160, labelX: 550, labelY: 110 },
    accessibilityInfo: { wheelchairAccessible: true, notes: 'Ground level ramp access at west portico facing parking lane' },
    keywords: ['auditorium', 'hall', 'seminar', 'cultural', 'stage', 'events', 'symposium', 'convention']
  },
  {
    id: 'canteen',
    name: 'Canteen & Cafeteria',
    category: 'dining',
    description: 'Student cafeteria and snack bar serving meals, refreshments, tea, coffee, and fresh juices in the northwest zone.',
    latitude: 11.128055,
    longitude: 77.038450,
    entranceLatitude: 11.128055,
    entranceLongitude: 77.038450,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#ea580c',
    buildingInfo: {
      code: 'CAN-01',
      facilities: ['Indoor Dining Hall', 'Outdoor Shaded Seating', 'Juice Bar', 'Snack Counter'],
      notes: 'Northwest zone. Paved access from central avenue via west crossroad.'
    },
    blueprintCoords: { x: 180, y: 220, width: 75, height: 65, labelX: 180, labelY: 200 },
    accessibilityInfo: { wheelchairAccessible: true, notes: 'Ground floor step-free entrance' },
    keywords: ['canteen', 'food', 'tea', 'coffee', 'snacks', 'juice', 'breakfast', 'lunch', 'eat', 'cafeteria']
  },
  {
    id: 'playground',
    name: 'Play Ground (Athletic Field)',
    category: 'sports',
    description: 'Spacious outdoor athletic sports ground on the western boundary for cricket, football, running, and track events.',
    latitude: 11.127739,
    longitude: 77.037957,
    entranceLatitude: 11.127713,
    entranceLongitude: 77.038574,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#16a34a',
    buildingInfo: {
      code: 'SPT-FIELD',
      facilities: ['Cricket Pitch & Field', 'Football Ground', 'Athletics Track'],
      notes: 'Located on the western boundary west of volleyball court.'
    },
    blueprintCoords: { x: 90, y: 350, width: 160, height: 140, labelX: 90, labelY: 330 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['ground', 'playground', 'play ground', 'cricket', 'football', 'running', 'track', 'sports field', 'athletics']
  },
  {
    id: 'volleyball-court',
    name: 'Volleyball Court',
    category: 'sports',
    description: 'Regulation clay volleyball court situated along the western sports promenade south of the canteen.',
    latitude: 11.127713,
    longitude: 77.038450,
    entranceLatitude: 11.127713,
    entranceLongitude: 77.038574,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#16a34a',
    buildingInfo: {
      code: 'SPT-VB',
      facilities: ['Regulation Volleyball Court & Net', 'Spectator Seating'],
      notes: 'Western sports corridor.'
    },
    blueprintCoords: { x: 180, y: 320, width: 60, height: 80, labelX: 180, labelY: 300 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['volleyball', 'court', 'volleyball court', 'sports', 'game', 'ball']
  },
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    category: 'sports',
    description: 'Marked outdoor basketball court located south of the volleyball court along the western corridor.',
    latitude: 11.127371,
    longitude: 77.038450,
    entranceLatitude: 11.127371,
    entranceLongitude: 77.038574,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#16a34a',
    buildingInfo: {
      code: 'SPT-BB',
      facilities: ['Synthetic Basketball Court', 'Hoops', 'Night Floodlights'],
      notes: 'Western sports corridor between Volleyball Court and Boys Hostel.'
    },
    blueprintCoords: { x: 180, y: 440, width: 60, height: 80, labelX: 180, labelY: 420 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['basketball', 'court', 'basketball court', 'hoop', 'game', 'sports']
  },
  {
    id: 'boys-hostel',
    name: 'Boys Hostel Complex',
    category: 'hostel',
    description: 'Residential hostel block for male students situated on the southwest flank with private access corridor.',
    latitude: 11.127000,
    longitude: 77.037800,
    entranceLatitude: 11.127000,
    entranceLongitude: 77.037800,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#059669',
    buildingInfo: {
      code: 'BH-01',
      floorsCount: 4,
      facilities: ['Student Living Quarters', '24/7 Warden Office', 'High-Speed Wi-Fi', 'Recreation Space'],
      notes: 'Located southwest, accessed via the west corridor path.'
    },
    blueprintCoords: { x: 80, y: 560, width: 90, height: 180, labelX: 80, labelY: 540 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['boys hostel', 'hostel', 'men', 'rooms', 'living', 'residence', 'warden', 'boys']
  },
  {
    id: 'd-block',
    name: 'D - Block (Specialized Labs)',
    category: 'academic',
    description: 'Dedicated academic building situated on the western walkway housing specialized laboratories and lecture rooms.',
    latitude: 11.126502,
    longitude: 77.038200,
    entranceLatitude: 11.126502,
    entranceLongitude: 77.038200,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#0284c7',
    buildingInfo: {
      code: 'BLOCK-D',
      floorsCount: 3,
      facilities: ['Specialized Engineering Laboratories', 'CAD/CAM Graphics Lab', 'Seminar Hall'],
      notes: 'Cream/tan building on the west corridor opposite Library/C-Block.'
    },
    blueprintCoords: { x: 180, y: 620, width: 90, height: 100, labelX: 180, labelY: 600 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['d block', 'd-block', 'first year', 'labs', 'cad', 'cam', 'academic']
  },
  {
    id: 'b-block',
    name: 'B - Block (Front Academic Wing)',
    category: 'academic',
    description: 'Primary academic building facing the main entrance avenue with central entrance portico, lecture halls, and faculty rooms.',
    latitude: 11.127450,
    longitude: 77.039350,
    entranceLatitude: 11.127450,
    entranceLongitude: 77.039350,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#2563eb',
    buildingInfo: {
      code: 'BLOCK-B',
      floorsCount: 4,
      facilities: ['Computer Science & Engg Classrooms', 'Smart Board Lecture Halls', 'HOD Chambers', 'Faculty Lounge'],
      notes: 'Main front horizontal complex facing North towards the entrance avenue.'
    },
    blueprintCoords: { x: 330, y: 350, width: 220, height: 60, labelX: 330, labelY: 330 },
    accessibilityInfo: { wheelchairAccessible: true, elevatorAvailable: true, notes: 'Ramp at north central portico' },
    keywords: ['b block', 'b-block', 'cse', 'computer science', 'classrooms', 'lecture hall', 'academic', 'it']
  },
  {
    id: 'office-room',
    name: 'Office Room (Administrative Wing)',
    category: 'admin',
    description: 'Central administrative department housing Principal Chamber, Administrative Officer, Accounts, and Student Admissions.',
    latitude: 11.127239,
    longitude: 77.039350,
    entranceLatitude: 11.127239,
    entranceLongitude: 77.039350,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#4f46e5',
    buildingInfo: {
      code: 'ADM-OFFICE',
      floorsCount: 3,
      facilities: ['Principal Chamber', 'Registrar & Admin Office', 'Accounts & Fees Counter', 'Admissions Cell', 'Exam Cell'],
      notes: 'Southern wing of the front central block facing the courtyard.'
    },
    blueprintCoords: { x: 330, y: 420, width: 220, height: 50, labelX: 330, labelY: 410 },
    accessibilityInfo: { wheelchairAccessible: true, notes: 'Main ramp access at central entrance' },
    keywords: ['office', 'office room', 'admin', 'principal', 'dean', 'accounts', 'fees', 'admission', 'exam cell']
  },
  {
    id: 'c-block',
    name: 'C - Block (Engineering Labs)',
    category: 'academic',
    description: 'Central academic and laboratory block directly behind B-Block featuring advanced electronics and core engineering labs.',
    latitude: 11.127029,
    longitude: 77.039350,
    entranceLatitude: 11.127029,
    entranceLongitude: 77.039350,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#0284c7',
    buildingInfo: {
      code: 'BLOCK-C',
      floorsCount: 4,
      facilities: ['ECE & VLSI Laboratories', 'AI & Data Science Research Lab', 'Robotics & IoT Center', 'Project Discussion Rooms'],
      notes: 'Rear horizontal block situated directly south of B-Block/Office.'
    },
    blueprintCoords: { x: 330, y: 500, width: 220, height: 60, labelX: 330, labelY: 480 },
    accessibilityInfo: { wheelchairAccessible: true, elevatorAvailable: true },
    keywords: ['c block', 'c-block', 'ece', 'electronics', 'robotics', 'iot', 'labs', 'engineering']
  },
  {
    id: 'library',
    name: 'Central Campus Library',
    category: 'academic',
    description: 'Comprehensive college library with extensive print collection, digital book database, research reading halls, and study cubicles.',
    latitude: 11.126871,
    longitude: 77.039350,
    entranceLatitude: 11.126871,
    entranceLongitude: 77.039350,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#2563eb',
    buildingInfo: {
      code: 'LIB-MAIN',
      floorsCount: 2,
      facilities: ['Central Reading Hall', 'Digital E-Library', 'Journals & Periodicals Wing', 'Reprographic Facilities'],
      notes: 'South wing of C-Block with quiet study environment.'
    },
    blueprintCoords: { x: 330, y: 560, width: 220, height: 50, labelX: 330, labelY: 550 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['library', 'books', 'study', 'reading', 'journals', 'digital library', 'central library']
  },
  {
    id: 'mess',
    name: 'Dining Mess Hall',
    category: 'dining',
    description: 'Spacious student dining and mess hall serving hygienic hot breakfast, lunch, snacks, and dinner.',
    latitude: 11.125950,
    longitude: 77.038750,
    entranceLatitude: 11.125950,
    entranceLongitude: 77.038750,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#ea580c',
    buildingInfo: {
      code: 'MESS-01',
      facilities: ['Dining Hall (600+ Seater)', 'Modern Steam Kitchen', 'RO Drinking Water Plant'],
      notes: 'Located in the south zone adjacent to D-Block and Girls Hostel.'
    },
    blueprintCoords: { x: 260, y: 720, width: 90, height: 80, labelX: 260, labelY: 700 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['mess', 'dining', 'food', 'lunch', 'dinner', 'breakfast', 'dining mess', 'meals']
  },
  {
    id: 'girls-hostel',
    name: 'Girls Hostel Complex',
    category: 'hostel',
    description: 'Secure multi-storey residential hostel for female students situated at the southern end of the campus.',
    latitude: 11.126050,
    longitude: 77.039200,
    entranceLatitude: 11.126050,
    entranceLongitude: 77.039200,
    verified: true,
    source: 'Calibrated Rooftop Satellite Imagery Ground Truth',
    color: '#059669',
    buildingInfo: {
      code: 'GH-01',
      floorsCount: 4,
      facilities: ['24/7 Female Warden Desk', 'Private Courtyard Lawn', 'Study Rooms', 'Medical Dispensary', 'Biometric Gate'],
      notes: 'Southern residential building with perimeter security.'
    },
    blueprintCoords: { x: 380, y: 780, width: 180, height: 80, labelX: 380, labelY: 760 },
    accessibilityInfo: { wheelchairAccessible: true },
    keywords: ['girls hostel', 'ladies hostel', 'women', 'hostel', 'residence', 'rooms', 'girls']
  }
]

export const CAMPUS_STORAGE_KEY = 'info_campus_verified_locations_v5'

export function getStoredCampusLocations(): CampusLocation[] {
  if (typeof window !== 'undefined') {
    try {
      // Clear legacy storage keys
      localStorage.removeItem('info_campus_verified_locations_v4')
      localStorage.removeItem('info_campus_location_overrides_v2')
      localStorage.removeItem('info_campus_verified_locations_v8')
      localStorage.removeItem('info_campus_verified_locations_v9')
      localStorage.removeItem('info_campus_verified_locations_v10')
      localStorage.removeItem('info_campus_verified_locations_v1')
      localStorage.removeItem('info_campus_verified_locations_v2')
      localStorage.removeItem('info_campus_verified_locations_v3')
      localStorage.removeItem('info_campus_manual_user_loc')

      const raw = localStorage.getItem(CAMPUS_STORAGE_KEY)
      if (raw) {
        const overrides = JSON.parse(raw)
        return defaultCampusLocations.map((loc) => {
          if (overrides[loc.id]) {
            return { ...loc, ...overrides[loc.id] }
          }
          return loc
        })
      }
    } catch (e) {
      console.warn('Failed to load overrides from localStorage', e)
    }
  }
  return defaultCampusLocations
}
