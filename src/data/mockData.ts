import { Ticket, VizagZone, HazardCategory } from '../types/civic';

const RAW_VIZAG_TICKETS: any[] = [
  {
    id: 'CP-101',
    title: 'Deep Asphalt Craters on Sector 4 Main Road near Rythu Bazar',
    category: 'Pothole / Road Damage',
    zone: 'MVP Colony',
    address: 'Sector 4 Main Road, opposite Rythu Bazar, MVP Colony, Visakhapatnam',
    latitude: 17.7431,
    longitude: 83.3364,
    description:
      'Multiple craters over 12 inches deep along the active RTC bus transit route. Two-wheelers frequently skid during evening hours.',
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    resolvedImageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=600&q=80',
    status: 'In Progress',
    urgencyScore: 8.8,
    urgencyLevel: 'High',
    upvotes: 38,
    reportedAt: '2026-11-04 08:30 AM',
    isSample: true,
    duplicateCount: 6,
    bundledTicketIds: ['CP-101-A', 'CP-101-B', 'CP-101-C'],
    assignedDepartment: 'GVMC Engineering (Zone 2 - MVP Ward 18)',
    assignedOfficer: 'Sri. K. Ramesh (Asst. Executive Engineer)',
    estimatedSlaHours: 24,
    adminNotes:
      'Bitumen emulsion batch ordered. Cold mix patching crew scheduled for night shift.',
    aiVerificationDetails: {
      hazardFactors: [
        'Two-wheeler skidding risk',
        'Peak RTC bus transit corridor',
        'Water pooling in crater',
      ],
      triageReasoning:
        'Heavy traffic density between MVP Double Road and Beach Road. Urgent patching required.',
      photoProofStatus: 'Pending Resolution',
      commuterImpact:
        'High probability of tire rim bending and commuter injury.',
    },
  },
  {
    id: 'CP-102',
    title: 'Overflowing Dumper Bin & Stray Cattle Hazard near North Ext Park',
    category: 'Garbage & Waste Overflow',
    zone: 'Seethammadhara',
    address:
      "Near North Extension Children's Park, Seethammadhara, Visakhapatnam",
    latitude: 17.7385,
    longitude: 83.315,
    description:
      'Municipal dumper bin has not been cleared for 4 days. Waste spilled 15 meters onto road, attracting stray dogs and cattle.',
    imageUrl:
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
    resolvedImageUrl:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    status: 'Resolved (Photo Verified)',
    urgencyScore: 7.9,
    urgencyLevel: 'Medium',
    upvotes: 45,
    reportedAt: '2026-11-03 07:15 AM',
    isSample: true,
    duplicateCount: 4,
    bundledTicketIds: ['CP-102-A', 'CP-102-B'],
    assignedDepartment: 'GVMC Public Health & Sanitation (Zone 3)',
    assignedOfficer: 'Smt. L. Sunitha (Sanitary Inspector)',
    estimatedSlaHours: 12,
    adminNotes:
      'Compactor vehicle dispatched. Entire perimeter cleared and bleaching powder applied.',
    aiVerificationDetails: {
      hazardFactors: [
        'Public health sanitation breach',
        'Stray animal traffic obstruction',
        'Foul odor near park',
      ],
      triageReasoning:
        'Proximity to school transit route and senior citizen park. Cleaned & lime powder sprinkled.',
      photoProofStatus: 'Verified by Citizen Review',
      commuterImpact: 'Pedestrian hazard and foul stench.',
    },
  },
  {
    id: 'CP-103',
    title: 'Defective High-Mast Light & Blind Turn Risk at Siripuram Junction',
    category: 'Streetlight / Electrical',
    zone: 'Siripuram',
    address: 'Near Waltair Club Road turning, Siripuram, Visakhapatnam',
    latitude: 17.7229,
    longitude: 83.3158,
    description:
      'Four lamp arrays out of six on the high mast are dark. Major blind turn for traffic coming from Andhra University gate.',
    imageUrl:
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    urgencyScore: 8.2,
    urgencyLevel: 'High',
    upvotes: 29,
    reportedAt: '2026-11-04 07:45 PM',
    isSample: true,
    duplicateCount: 3,
    bundledTicketIds: ['CP-103-A'],
    assignedDepartment: 'GVMC Electrical Wing (Zone 2)',
    assignedOfficer: 'Sri. P. Venkatesh (Divisional Engineer Electrical)',
    estimatedSlaHours: 18,
    adminNotes:
      'Work order created for hydraulic lift vehicle. Waiting for replacement driver module.',
    aiVerificationDetails: {
      hazardFactors: [
        'Extreme blind spot for night commuters',
        'AU Student pedestrian crossing',
        'Speeding traffic from Uplands',
      ],
      triageReasoning:
        'Accident blackspot at night. Needs immediate cherry-picker lamp driver replacement.',
      photoProofStatus: 'Pending Resolution',
      commuterImpact: 'Night visibility dropped by 70%.',
    },
  },
  {
    id: 'CP-104',
    title: 'Major Drinking Water Pipeline Rupture Flooding 3rd Lane',
    category: 'Water Leak / Drainage',
    zone: 'Dwaraka Nagar',
    address: '3rd Lane, Opposite Diamond Park, Dwaraka Nagar, Visakhapatnam',
    latitude: 17.7262,
    longitude: 83.3038,
    description:
      'High-pressure potable water gushing from underground pipeline joint since 5 AM. Thousands of liters wasted and asphalt loosening.',
    imageUrl:
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    resolvedImageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    status: 'Resolved (Photo Verified)',
    urgencyScore: 9.2,
    urgencyLevel: 'Critical',
    upvotes: 52,
    reportedAt: '2026-11-02 06:10 AM',
    isSample: true,
    duplicateCount: 8,
    bundledTicketIds: ['CP-104-A', 'CP-104-B', 'CP-104-C', 'CP-104-D'],
    assignedDepartment: 'GVMC Water Supply & Sewerage Division',
    assignedOfficer: 'Sri. B. Satyanarayana (Executive Engineer Water)',
    estimatedSlaHours: 8,
    adminNotes:
      'Main isolation valve shut. Ruptured GI collar replaced with ductile iron clamp.',
    aiVerificationDetails: {
      hazardFactors: [
        'Precious drinking water wastage',
        'Sub-base soil erosion',
        'Traffic diversion required',
      ],
      triageReasoning:
        'Pipe collar replaced and asphalt temporarily backfilled. Hydrostatic pressure restored.',
      photoProofStatus: 'Verified by Citizen Review',
      commuterImpact:
        'Waterlogging across lane impeding shopping traffic.',
    },
  },
  {
    id: 'CP-105',
    title: 'Broken Cast Iron Drain Cover - 5ft Drop Hazard on Beach Walkway',
    category: 'Open Manhole / Safety Hazard',
    zone: 'RK Beach Road',
    address: 'Near Kali Temple Promenade, Beach Road, Visakhapatnam',
    latitude: 17.7126,
    longitude: 83.3225,
    description:
      'Stormwater drain slab collapsed directly in front of the morning walking promenade. Dangerous drop of 5 feet.',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    status: 'In Progress',
    urgencyScore: 9.5,
    urgencyLevel: 'Critical',
    upvotes: 74,
    reportedAt: '2026-11-04 06:00 AM',
    isSample: true,
    duplicateCount: 9,
    bundledTicketIds: ['CP-105-A', 'CP-105-B', 'CP-105-C'],
    assignedDepartment: 'GVMC Engineering (Zone 2 Coastal Infrastructure)',
    assignedOfficer: 'Sri. T. Appala Naidu (Superintending Engineer)',
    estimatedSlaHours: 12,
    adminNotes:
      'Emergency safety barricades erected with caution tape. Precast RCC slab ordered from yard.',
    aiVerificationDetails: {
      hazardFactors: [
        'Fatal fall risk for elderly morning walkers',
        'High tourist density zone',
        'Unbarricaded open drop',
      ],
      triageReasoning:
        'Immediate safety barricading deployed by ward marshals. Heavy precast RCC slab fabrication underway.',
      photoProofStatus: 'Pending Resolution',
      commuterImpact:
        'Imminent danger of pedestrian fracture or fall into drain.',
    },
  },
  {
    id: 'CP-106',
    title: 'Dangling High-Tension Optical Cables Obstructing Auto Lane',
    category: 'Streetlight / Electrical',
    zone: 'Maddilapalem',
    address: 'Near Maddilapalem Bus Station Circle, Visakhapatnam',
    latitude: 17.736,
    longitude: 83.3255,
    description:
      'Snapped telecom and overhead service cables hanging at 4 feet height right into the auto-rickshaw parking lane.',
    imageUrl:
      'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    urgencyScore: 7.4,
    urgencyLevel: 'Medium',
    upvotes: 21,
    reportedAt: '2026-11-05 09:15 AM',
    isSample: true,
    duplicateCount: 2,
    assignedDepartment: 'GVMC Town Planning & Discom Coordination',
    assignedOfficer: 'Sri. G. Murali Krishna (Town Planning Officer)',
    estimatedSlaHours: 24,
    adminNotes:
      'Broadband service providers summoned to bundle overhead lines immediately.',
    aiVerificationDetails: {
      hazardFactors: [
        'Two-wheeler snagging hazard',
        'Obstruction of public transit bay',
        'Potential electrical induction',
      ],
      triageReasoning:
        'Non-energized internet cables tangled with street pole. Cable operators notified to bundle overhead.',
      photoProofStatus: 'Pending Resolution',
      commuterImpact: 'Head-level obstruction for cyclists.',
    },
  },
  {
    id: 'CP-107',
    title: 'Commercial Construction Debris Blockade on Industrial Link Road',
    category: 'Garbage & Waste Overflow',
    zone: 'Gajuwaka',
    address:
      'Main Commercial Road, near Old Gajuwaka Junction, Visakhapatnam',
    latitude: 17.6908,
    longitude: 83.2104,
    description:
      'Three truckloads of demolition rubble dumped encroaching half of the heavy vehicle lane.',
    imageUrl:
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
    status: 'In Progress',
    urgencyScore: 8.0,
    urgencyLevel: 'High',
    upvotes: 31,
    reportedAt: '2026-11-04 11:20 AM',
    isSample: true,
    duplicateCount: 3,
    assignedDepartment:
      'GVMC Enforcement & Solid Waste Cell (Zone 5 Gajuwaka)',
    assignedOfficer: 'Sri. Ch. Mohan Rao (Zonal Commissioner)',
    estimatedSlaHours: 24,
    adminNotes:
      'JCB earthmover engaged. Penalty notice served on unauthorized contractor.',
    aiVerificationDetails: {
      hazardFactors: [
        'Heavy trailer truck bottlenecks',
        'Illegal roadside dumping penalty',
        'Sharp rebar hazard',
      ],
      triageReasoning:
        'JCB loader dispatched for clearance and penalty notice issued to property builder.',
      photoProofStatus: 'Pending Resolution',
      commuterImpact:
        '30-minute traffic snarls during industrial shift changes.',
    },
  },
  {
    id: 'CP-108',
    title: 'Severe Monsoon Waterlogging & Clogged Culvert at IT SEZ Road',
    category: 'Water Leak / Drainage',
    zone: 'Madhurawada',
    address: 'Hill No. 2 Approach Road, IT SEZ, Madhurawada, Visakhapatnam',
    latitude: 17.8202,
    longitude: 83.3512,
    description:
      'Underground culvert blocked with plastic waste causing 1.5 feet water stagnation across 60 meters of tech corridor road.',
    imageUrl:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    status: 'In Progress',
    urgencyScore: 8.6,
    urgencyLevel: 'High',
    upvotes: 43,
    reportedAt: '2026-11-05 08:00 AM',
    isSample: true,
    duplicateCount: 5,
    bundledTicketIds: ['CP-108-A', 'CP-108-B'],
    assignedDepartment: 'GVMC Engineering (Zone 1 Madhurawada)',
    assignedOfficer: 'Smt. K. Bhavani (Executive Engineer Drainage)',
    estimatedSlaHours: 16,
    adminNotes:
      'Suction tanker deployed. Culvert grill cleared of accumulated debris.',
    aiVerificationDetails: {
      hazardFactors: [
        'Vehicle engine hydrostatic lock hazard',
        'Tech park employee commute delay',
        'Vector breeding spot',
      ],
      triageReasoning:
        'Suction tanker and culvert desilting gang active on site.',
      photoProofStatus: 'Pending Resolution',
      commuterImpact:
        'Cars stalled and traffic backed up till NH16 junction.',
    },
  },
];

export const INITIAL_VIZAG_TICKETS: Ticket[] = RAW_VIZAG_TICKETS.map((t) => ({
  ...t,
  retestCount: t.status === 'Resolved (Photo Verified)' ? 2 : 1,
  retestStatus:
    t.status === 'Resolved (Photo Verified)'
      ? 'Retested Safe'
      : t.status === 'In Progress'
      ? 'Retest Scheduled'
      : 'Initial Inspection',
  lastRetestedAt:
    t.status === 'Resolved (Photo Verified)'
      ? '2026-11-05 11:30 AM'
      : '2026-11-04 04:15 PM',
  nextScheduledRetestAt:
    t.status === 'Resolved (Photo Verified)'
      ? '2026-11-08 09:00 AM (Post-Curing)'
      : '2026-11-06 10:00 AM',
  retestAuditLog: [
    {
      id: `RTEST-${t.id}-1`,
      timestamp:
        t.status === 'Resolved (Photo Verified)'
          ? '2026-11-05 11:30 AM'
          : '2026-11-04 04:15 PM',
      inspectorType: 'AI Drone Sensor' as const,
      result: 'Passed' as const,
      notes:
        'Multi-spectral sensor scanned surface flushness. Zero rim-deformation risk detected.',
      structuralPassRate: 98.4,
      geotagHash: `0x${t.id}_GEO_PASS_9948`,
    },
    {
      id: `RTEST-${t.id}-2`,
      timestamp: '2026-11-04 05:20 PM',
      inspectorType: 'Citizen Ward Auditor' as const,
      result: 'Passed' as const,
      notes: 'Local RWA audit team inspected and approved field barrier clearance.',
      structuralPassRate: 96.2,
      geotagHash: `0x${t.id}_RWA_VERIF`,
    },
  ],
  godModeAnalysis: {
    structuralIntegrityScore: t.status === 'Resolved (Photo Verified)' ? 96 : 42,
    casualtyRiskRating:
      t.urgencyLevel === 'Critical'
        ? ('Severe Hazard' as const)
        : ('Moderate' as const),
    monsoonErosionVulnerability: 'Class B-3 (Moderate Runoff Absorption)',
    coastalSalinityIndex: '0.84 (High Coastal Salinity Aerosol)',
    rootCauseAnalysis:
      'Sub-base moisture penetration exacerbated by monsoon storm runoff and heavy RTC bus axle loading.',
    microCoordinates: `${t.latitude.toFixed(6)}° N, ${t.longitude.toFixed(6)}° E (WGS84)`,
    materialEstimation:
      '2.4 Tons Bituminous Cold-Mix VG-30 + 1.2 cu.m Crushed Aggregate',
    estimatedRepairCostINR: '₹18,500',
    emergencyBypassRoute: `Divert via ${t.zone} Arterial Double Road`,
    satelliteAuditConfidence: 99.2,
  },
}));

export const VIZAG_ZONES: VizagZone[] = [
  {
    name: 'MVP Colony',
    lat: 17.7431,
    lng: 83.3364,
    ward: 'Ward 18 (Zone 2)',
    dept: 'GVMC Engineering (Zone 2)',
  },
  {
    name: 'Seethammadhara',
    lat: 17.7385,
    lng: 83.315,
    ward: 'Ward 22 (Zone 3)',
    dept: 'GVMC Public Health (Zone 3)',
  },
  {
    name: 'Siripuram',
    lat: 17.7229,
    lng: 83.3158,
    ward: 'Ward 19 (Zone 2)',
    dept: 'GVMC Electrical Wing',
  },
  {
    name: 'RK Beach Road',
    lat: 17.7126,
    lng: 83.3225,
    ward: 'Ward 20 (Coastal Zone)',
    dept: 'GVMC Coastal Engineering',
  },
  {
    name: 'Dwaraka Nagar',
    lat: 17.7262,
    lng: 83.3038,
    ward: 'Ward 25 (Zone 3)',
    dept: 'GVMC Water Supply',
  },
  {
    name: 'Madhurawada',
    lat: 17.8202,
    lng: 83.3512,
    ward: 'Ward 5 (Zone 1)',
    dept: 'GVMC Engineering (Zone 1)',
  },
  {
    name: 'Gajuwaka',
    lat: 17.6908,
    lng: 83.2104,
    ward: 'Ward 64 (Zone 5)',
    dept: 'GVMC Enforcement Cell',
  },
  {
    name: 'Maddilapalem',
    lat: 17.736,
    lng: 83.3255,
    ward: 'Ward 21 (Zone 2)',
    dept: 'GVMC Town Planning',
  },
];

export const CATEGORIES: HazardCategory[] = [
  'Pothole / Road Damage',
  'Garbage & Waste Overflow',
  'Streetlight / Electrical',
  'Water Leak / Drainage',
  'Open Manhole / Safety Hazard',
];

export const SAMPLE_PRESETS = [
  {
    label: '✓ Crater Pothole (MVP Sector 4)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    category: 'Pothole / Road Damage' as HazardCategory,
    zone: 'MVP Colony',
    lat: 17.7431,
    lng: 83.3364,
    desc: 'Severe asphalt crater near Sector 4 intersection causing bike skidding.',
    isHazard: true,
  },
  {
    label: '✓ Overflowing Garbage (Seethammadhara)',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
    category: 'Garbage & Waste Overflow' as HazardCategory,
    zone: 'Seethammadhara',
    lat: 17.7385,
    lng: 83.315,
    desc: 'Dumper bin spilling onto main lane, attracting stray dogs and bad odor.',
    isHazard: true,
  },
  {
    label: '✓ High Mast Dark (Siripuram)',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    category: 'Streetlight / Electrical' as HazardCategory,
    zone: 'Siripuram',
    lat: 17.7229,
    lng: 83.3158,
    desc: 'Junction light failure creating dangerous blind corner at night.',
    isHazard: true,
  },
  {
    label: '✓ Broken Water Main (Dwaraka Nagar)',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    category: 'Water Leak / Drainage' as HazardCategory,
    zone: 'Dwaraka Nagar',
    lat: 17.7262,
    lng: 83.3038,
    desc: 'Pressurized pipe ruptured flooding street and eroding road subgrade.',
    isHazard: true,
  },
  {
    label: '✓ Open Drain / Manhole (Beach Road)',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    category: 'Open Manhole / Safety Hazard' as HazardCategory,
    zone: 'RK Beach Road',
    lat: 17.7126,
    lng: 83.3225,
    desc: 'Concrete slab collapsed on pedestrian walkway, 5-foot perilous drop.',
    isHazard: true,
  },
  {
    label: '❌ Test Rejection: Personal Selfie',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    category: 'Auto-Detect' as any,
    zone: 'Siripuram',
    lat: 17.7229,
    lng: 83.3158,
    desc: 'Student personal selfie photo taken with camera outside. (Non-hazard rejection test)',
    isHazard: false,
  },
  {
    label: '❌ Test Rejection: Pet Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    category: 'Auto-Detect' as any,
    zone: 'MVP Colony',
    lat: 17.7431,
    lng: 83.3364,
    desc: 'Cute domestic pet cat relaxing on indoor carpet. (Non-hazard rejection test)',
    isHazard: false,
  },
  {
    label: '❌ Test Rejection: Food / Coffee Lunch',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'Auto-Detect' as any,
    zone: 'Dwaraka Nagar',
    lat: 17.7262,
    lng: 83.3038,
    desc: 'Plate of gourmet burger and coffee at lunch café. (Non-hazard rejection test)',
    isHazard: false,
  },
];

// Realistic Commute Waypoints in Visakhapatnam for Simulated Live Tracking & AI Interference testing
export const SIMULATED_ROUTES = [
  {
    id: 'mvp-transit',
    name: 'MVP Colony to Siripuram Commute',
    description: 'Passing Rythu Bazar crater (CP-101) and Siripuram junction (CP-103)',
    waypoints: [
      { lat: 17.7455, lng: 83.3385, speed: 28, heading: 215 },
      { lat: 17.7441, lng: 83.3372, speed: 22, heading: 210 },
      { lat: 17.7432, lng: 83.3365, speed: 14, heading: 205 }, // CP-101 Trigger (~20m)
      { lat: 17.7420, lng: 83.3350, speed: 30, heading: 220 },
      { lat: 17.7390, lng: 83.3300, speed: 35, heading: 215 },
      { lat: 17.7360, lng: 83.3255, speed: 18, heading: 210 }, // Maddilapalem (CP-106)
      { lat: 17.7300, lng: 83.3200, speed: 32, heading: 205 },
      { lat: 17.7235, lng: 83.3162, speed: 15, heading: 200 }, // Siripuram (CP-103)
      { lat: 17.7229, lng: 83.3158, speed: 0, heading: 195 },
    ],
  },
  {
    id: 'beach-promenade',
    name: 'RK Beach Road Promenade Walk',
    description: 'Walking from Submarine Museum to Kali Temple broken drain (CP-105)',
    waypoints: [
      { lat: 17.7160, lng: 83.3280, speed: 5, heading: 220 },
      { lat: 17.7145, lng: 83.3255, speed: 5, heading: 222 },
      { lat: 17.7135, lng: 83.3238, speed: 4, heading: 225 },
      { lat: 17.7128, lng: 83.3228, speed: 2, heading: 228 }, // Imminent drop CP-105! (~35m)
      { lat: 17.7126, lng: 83.3225, speed: 0, heading: 230 }, // Right on hazard
      { lat: 17.7120, lng: 83.3218, speed: 4, heading: 232 },
    ],
  },
];

export const TRANSLATIONS = {
  en: {
    appName: 'CivixAI',
    appSubname: 'Civic Intelligence Vizag',
    headline:
      "Report Vizag's civic hazards in seconds, get live AI route protection, eliminate duplicate complaints, and verify photo-proof fixes.",
    problemStatement:
      'Urban residents in Visakhapatnam waste time and risk accidents because existing municipal channels lack live location hazard tracking, automated deduplication, and verifiable photo proof of repair.',
    navHome: 'Overview',
    navTracker: 'Live Map & GPS Tracker',
    navReport: 'Report Hazard',
    navAdmin: 'GVMC Official Desk',
    navAbout: 'About & Research',
    ctaReport: 'Report a Civic Hazard',
    ctaExplore: 'Launch Live GPS Map',
    ctaAdmin: 'GVMC Admin Portal',
    stat1Label: 'GVMC Weekly Grievances',
    stat1Val: '800+ Complaints/wk',
    stat1Desc: 'Across engineering, roads & public health (GVMC PGRS Data)',
    stat2Label: 'Monsoon Road Spikes',
    stat2Val: '3.4x Infrastructure Damage',
    stat2Desc: 'Reported in MVP & Seethammadhara (Deccan Chronicle Reports)',
    stat3Label: 'Citizen Pain Index',
    stat3Val: '8 / 10 Pain Score',
    stat3Desc: 'Due to duplicate tickets, slow triage & ghost ticket closures',
    diffTitle: 'What Makes CivixAI Different?',
    diffDesc:
      'None of the existing tools combine live GPS commuter hazard radar with AI 200m proximity deduplication and transparent photo-proof verification loops.',
    diff1: 'Live GPS Commuter Hazard Radar & Proximity Interventions',
    diff2: 'AI Proximity Deduplication (200m auto-clustering)',
    diff3: 'Bilateral Photo-Proof Resolution Audited by Citizens',
    sampleBadge: 'Sample',
    clearData: 'Reset Data',
    searchPlaceholder:
      'Search zone (MVP Colony, Beach Road), category, or keyword...',
    allZones: 'All Vizag Zones',
    allCategories: 'All Hazard Types',
    allStatuses: 'All Statuses',
    upvote: 'I also saw this',
    verified: 'Photo Proof Verified',
    duplicateAlert: 'Nearby Duplicate Hazard Detected (within 200m)!',
    duplicateInfo:
      'A matching complaint was detected within 200 metres of your location. Upvoting merges your report to escalate municipal priority immediately!',
    mergeWithExisting: 'Merge & Boost Priority (+1 Upvote)',
    submitAsNew: 'Submit as New Unique Issue',
    formTitle: 'Report a Civic Hazard in Visakhapatnam',
    formSubtitle:
      'Snap or upload a photo, lock live GPS coordinates, and let CivixAI analyze the hazard, detect duplicates, and route to GVMC.',
    photoLabel: 'Hazard Photograph',
    photoUploadBtn: 'Upload / Snap Photo',
    photoPresetTitle: 'Quick 1-Click Test Scenarios:',
    gpsLabel: 'Hazard Geolocation & Vizag Zone',
    gpsDetectBtn: 'Capture Live GPS',
    gpsAccurate: 'GPS Location Locked',
    zoneLabel: 'Zone / Ward Division',
    catLabel: 'Category (or AI Auto-Classify)',
    descLabel: 'Description & Specific Landmark Details',
    submitBtn: 'Run AI Triage & Submit Report',
    submittingBtn: 'AI Analyzing Hazard & Checking 200m Radius...',
    verifyResolutionBtn: 'Inspect Photo Proof',
    resolveModalTitle: 'Municipal Photo-Proof Resolution Audit',
    beforePhoto: 'Before (Reported Hazard)',
    afterPhoto: 'After (GVMC Field Repair Proof)',
    confirmResolution: 'Confirm & Verify Resolution',
    rejectResolution: 'Flag Incomplete Repair',
    aiAnalysisHeader: 'CivixAI Municipal Triage Output',
    aiUrgency: 'AI Safety Hazard Score',
    aiRouting: 'GVMC Ward Officer Routing',
    aiFactors: 'Identified Hazard Factors',
    aiDeduplication: 'Proximity Deduplication Result',
    aiPhotoChecklist: 'Resolution Verification Checklist',
    adminTitle: 'GVMC Municipal Officials Management Portal',
    adminSubtitle:
      'Greater Visakhapatnam Municipal Corporation • Engineering & Sanitation Control Desk',
    adminTotal: 'Total Complaints',
    adminPending: 'Pending Triage',
    adminProgress: 'In Progress',
    adminResolved: 'Photo Verified & Resolved',
    adminDuplicatesSaved: 'Duplicates Merged',
    adminFilterDept: 'Filter by Department',
    adminAllDepts: 'All GVMC Departments',
    adminActionUpdate: 'Update Status & Attach Photo Proof',
    adminStatusChange: 'Change Status',
    adminSaveNotes: 'Save Official Update',
    adminOfficerNotes: 'Ward Officer Inspection Notes',
    adminAttachProof: 'Upload / Link Resolution Photo Proof',
    liveTrackerTitle: 'Live Commuter GPS & Hazard Radar',
    liveTrackerSubtitle:
      'Real-time GPS positioning, heading telemetry, and proactive AI interference alerts for safer transit across Vizag.',
    gpsActive: 'Live GPS Active',
    simulatingRoute: 'Route Simulation Running',
    centerOnMe: 'Center on Me',
    startSim: 'Simulate Commute',
    stopSim: 'Stop Simulation',
    proximitySound: 'Proximity Audio Alerts',
    nearestHazardsTitle: 'Proximity Hazard Radar (Closest to You)',
    noNearbyHazards: 'No civic hazards detected within 500m of your position.',
    simpleMode: 'Simple View',
    detailedMode: 'Detailed View',
  },
  te: {
    appName: 'సివిక్స్.AI (CivixAI)',
    appSubname: 'సివిక్ ఇంటెలిజెన్స్ విశాఖపట్నం',
    headline:
      'వైజాగ్ సమస్యలను సెకన్లలో నివేదించండి, లైవ్ లొకేషన్ అలర్ట్స్ పొందండి, AI తో డూప్లికేట్లను నివారించండి, ఫోటో ఆధారంతో పరిష్కారాన్ని ధృవీకరించండి.',
    problemStatement:
      'గ్రేటర్ విశాఖపట్నం మునిసిపల్ కార్పొరేషన్ (GVMC) పరిధిలో లైవ్ ట్రాకింగ్, డూప్లికేట్ ఫిర్యాదుల తొలగింపు మరియు పరిష్కార ఫోటో రుజువు లేకపోవడం వల్ల పౌరుల సమయం వృధా అవుతోంది.',
    navHome: 'హోమ్ (Home)',
    navTracker: 'లైవ్ మ్యాప్ & GPS ట్రాకర్',
    navReport: 'సమస్యను నివేదించండి',
    navAdmin: 'అధికారిక అడ్మిన్ డ్యాష్‌బోర్డ్',
    navAbout: 'గురించి & రీసెర్చ్',
    ctaReport: 'సమస్యను నివేదించండి',
    ctaExplore: 'లైవ్ GPS మ్యాప్ తెరవండి',
    ctaAdmin: 'అధికారుల పోర్టల్',
    stat1Label: 'వారపు GVMC ఫిర్యాదులు',
    stat1Val: '800+ ఫిర్యాదులు/వారం',
    stat1Desc: 'ఇంజనీరింగ్, రోడ్లు & ప్రజారోగ్య విభాగాల్లో (GVMC PGRS డేటా)',
    stat2Label: 'వర్షాకాలపు రోడ్ల నష్టం',
    stat2Val: '3.4 రెట్లు తీవ్రత',
    stat2Desc: 'MVP కాలనీ & సీతమ్మధారలో నివేదికలు (డెక్కన్ క్రానికల్)',
    stat3Label: 'పౌరుల అసంతృప్తి సూచిక',
    stat3Val: '8 / 10 తీవ్రత',
    stat3Desc: 'డూప్లికేట్ టిక్కెట్లు, నకిలీ క్లోజర్ల వల్ల ఏర్పడిన అసంతృప్తి',
    diffTitle: 'సివిక్స్.AI ప్రత్యేకత ఏమిటి?',
    diffDesc:
      'ప్రస్తుత ప్రభుత్వ యాప్‌లలో లైవ్ GPS ప్రయాణ రాడార్, 200 మీటర్ల డూప్లికేట్ క్లస్టరింగ్ మరియు ఫోటో-రుజువు ద్వారా ధృవీకరించే సౌకర్యం లేదు.',
    diff1: 'లైవ్ GPS ట్రాకింగ్ & AI భద్రతా హెచ్చరికలు',
    diff2: 'AI ప్రోక్సిమిటీ డి-డూప్లికేషన్ (200 మీటర్ల పరిధిలో గుర్తింపు)',
    diff3: 'పౌరుల ద్వారా ఫోటో-ప్రూఫ్ ప్రత్యక్ష ధృవీకరణ',
    sampleBadge: 'నమూనా (Sample)',
    clearData: 'డేటా రీసెట్',
    searchPlaceholder:
      'ప్రాంతం (MVP కాలనీ, సీతమ్మధార) లేదా సమస్య కోసం శోధించండి...',
    allZones: 'అన్ని వైజాగ్ ప్రాంతాలు',
    allCategories: 'అన్ని సమస్యలు',
    allStatuses: 'అన్ని స్థితులు',
    upvote: 'నేను కూడా చూశాను (+1)',
    verified: 'ఫోటో రుజువుతో పూర్తయింది',
    duplicateAlert: 'సమీపంలో (200 మీటర్లలో) ఇదే సమస్య గుర్తించబడింది!',
    duplicateInfo:
      'మీ స్థానానికి 200 మీటర్ల పరిధిలో ఇప్పటికే ఫిర్యాదు ఉంది. మద్దతు ఇవ్వడం వల్ల ప్రాధాన్యత వెంటనే పెరుగుతుంది!',
    mergeWithExisting: 'ఏకం చేసి ప్రాధాన్యత పెంచండి (+1 Upvote)',
    submitAsNew: 'కొత్త ఫిర్యాదుగా నమోదు చేయండి',
    formTitle: 'విశాఖపట్నంలో ప్రజా సమస్యను నివేదించండి',
    formSubtitle:
      'ఫోటో తీయండి, GPS లొకేషన్ ఎంచుకోండి; మా AI డూప్లికేట్లను గుర్తించి GVMC కి పంపుతుంది.',
    photoLabel: 'సమస్య ఫోటో',
    photoUploadBtn: 'ఫోటో అప్‌లోడ్ / స్నాప్',
    photoPresetTitle: 'సులభమైన టెస్టింగ్ దృశ్యాలు:',
    gpsLabel: 'సమస్య GPS లొకేషన్ & వైజాగ్ ప్రాంతం',
    gpsDetectBtn: 'లైవ్ GPS గుర్తించండి',
    gpsAccurate: 'GPS లొకేషన్ ఖచ్చితంగా నమోదైంది',
    zoneLabel: 'వైజాగ్ ప్రాంతం (Zone / Ward)',
    catLabel: 'సమస్య వర్గం (లేదా AI ఆటో వర్గీకరణ)',
    descLabel: 'వివరణ & సమీప గుర్తులు (Landmark)',
    submitBtn: 'AI ఆడిట్ చేసి నమోదు చేయండి',
    submittingBtn: 'AI విశ్లేషిస్తోంది (200మీ పరిశీలన)...',
    verifyResolutionBtn: 'పరిష్కార ఫోటోను తనిఖీ చేయండి',
    resolveModalTitle: 'మునిసిపల్ ఫోటో-ప్రూఫ్ పరిష్కార ఆడిట్',
    beforePhoto: 'ముందు (సమస్య ఉన్నప్పుడు)',
    afterPhoto: 'తర్వాత (GVMC మరమ్మత్తు రుజువు)',
    confirmResolution: 'పరిష్కారాన్ని ధృవీకరించండి',
    rejectResolution: 'సరిగా చేయలేదని రిపోర్ట్ చేయండి',
    aiAnalysisHeader: 'సివిక్స్.AI మున్సిపల్ విశ్లేషణ',
    aiUrgency: 'ప్రమాద తీవ్రత స్కోర్',
    aiRouting: 'GVMC వార్డు అధికారి కేటాయింపు',
    aiFactors: 'ప్రమాద కారకాలు',
    aiDeduplication: 'డూప్లికేట్ పరిశీలన ఫలితం',
    aiPhotoChecklist: 'పరిష్కార తనిఖీ జాబితా',
    adminTitle: 'GVMC మున్సిపల్ అధికారుల నిర్వహణ పోర్టల్',
    adminSubtitle:
      'గ్రేటర్ విశాఖపట్నం మున్సిపల్ కార్పొరేషన్ • ఇంజనీరింగ్ & శానిటేషన్ కంట్రోల్ డెస్క్',
    adminTotal: 'మొత్తం ఫిర్యాదులు',
    adminPending: 'పరిశీలనలో ఉన్నవి (Pending)',
    adminProgress: 'పని జరుగుతున్నవి (In Progress)',
    adminResolved: 'పూర్తయినవి (Resolved)',
    adminDuplicatesSaved: 'డూప్లికేట్లు ఆదా చేయబడ్డాయి',
    adminFilterDept: 'విభాగం వారీగా ఫిల్టర్',
    adminAllDepts: 'అన్ని GVMC విభాగాలు',
    adminActionUpdate: 'స్టేటస్ మార్చండి & ఫోటో రుజువు జతచేయండి',
    adminStatusChange: 'స్టేటస్ మార్పు',
    adminSaveNotes: 'అధికారిక నోట్స్ సేవ్ చేయండి',
    adminOfficerNotes: 'వార్డు అధికారి తనిఖీ నోట్స్',
    adminAttachProof: 'పరిష్కార ఫోటో అప్‌లోడ్ / లింక్ చేయండి',
    liveTrackerTitle: 'లైవ్ GPS కమ్యూటర్ & ప్రమాద రాడార్',
    liveTrackerSubtitle:
      'రియల్ టైమ్ GPS స్థానం, స్పీడ్ మరియు సమీప ప్రమాదాలపై AI భద్రతా హెచ్చరికలు.',
    gpsActive: 'లైవ్ GPS ఆన్ చేయబడింది',
    simulatingRoute: 'రూట్ సిమ్యులేషన్ నడుస్తోంది',
    centerOnMe: 'నా స్థానం చూపించు',
    startSim: 'టెస్ట్ ప్రయాణం ప్రారంభించు',
    stopSim: 'సిమ్యులేషన్ ఆపు',
    proximitySound: 'శబ్ద హెచ్చరికలు (Audio Alerts)',
    nearestHazardsTitle: 'సమీప ప్రమాదాల రాడార్ (మీకు దగ్గరగా ఉన్నవి)',
    noNearbyHazards: 'మీకు 500 మీటర్ల పరిధిలో ఎలాంటి సమస్యలు లేవు.',
    simpleMode: 'సులభమైన వీక్షణ',
    detailedMode: 'వివరమైన వీక్షణ',
  },
};
