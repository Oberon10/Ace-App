// ACE LOGISTICS — SHIPMENTS DATA STORE & MOCK REPOSITORY

export const INITIAL_SHIPMENTS = [
  {
    id: "ACE-2026-8F72K9",
    trackingNumber: "ACE-2026-8F72K9",
    status: "IN TRANSIT",
    statusCode: "transit",
    method: "Air Freight Priority",
    methodType: "air",
    origin: "Accra, Ghana",
    destination: "London Heathrow, UK",
    currentLocation: "Accra, Ghana (Flight En Route to LHR)",
    estimatedDelivery: "September 18, 2026",
    createdDate: "2026-09-10",
    customer: "Kwame Mensah",
    sender: {
      name: "Kwame Mensah",
      company: "Gold Coast Trading Ltd",
      phone: "+233 24 555 0192",
      email: "k.mensah@goldcoasttrading.com",
      address: "Plot 14, Industrial Area, Ring Road Central",
      city: "Accra",
      country: "Ghana"
    },
    receiver: {
      name: "Eleanor Vance",
      company: "Vance Global Ltd",
      phone: "+44 20 7946 0912",
      email: "eleanor.vance@vanceglobal.co.uk",
      address: "24 Bishopsgate, Floor 18",
      city: "London",
      country: "United Kingdom"
    },
    package: {
      type: "High-Value Electronic Sensors",
      weightKg: 42.5,
      dimensions: "60 × 45 × 40 cm",
      pieces: 3,
      declaredValue: "$12,450.00",
      insurance: "Full ACE All-Risk Coverage",
      sealNumber: "ACE-SL-90812"
    },
    charges: {
      freight: 410.00,
      fuelSurcharge: 45.00,
      customsHandling: 30.00,
      total: 485.00
    },
    timeline: [
      {
        id: 1,
        title: "Shipment Created",
        description: "Electronic shipping documentation generated and booking confirmed by ACE Logistics Ghana hub.",
        location: "Accra, Ghana",
        date: "Sep 10, 2026",
        time: "09:30 AM",
        status: "completed"
      },
      {
        id: 2,
        title: "Picked Up",
        description: "Consignment securely collected from sender warehouse by ACE express courier fleet.",
        location: "Accra, Ghana",
        date: "Sep 10, 2026",
        time: "02:15 PM",
        status: "completed"
      },
      {
        id: 3,
        title: "Processing & Security Screening",
        description: "Passed X-ray security scanning, weighed, palletized, and cleared for export at Kotoka Air Cargo Terminal.",
        location: "Kotoka Int. Airport, Accra",
        date: "Sep 11, 2026",
        time: "04:45 AM",
        status: "completed"
      },
      {
        id: 4,
        title: "In Transit — Flight ACE-802",
        description: "Departed Accra on cargo flight ACE-802 en route to London Heathrow distribution center.",
        location: "Accra Air Space -> London",
        date: "Sep 11, 2026",
        time: "09:20 PM",
        status: "active"
      },
      {
        id: 5,
        title: "Customs Clearance",
        description: "Scheduled for UK Border Agency declaration and priority import clearance.",
        location: "Heathrow World Cargo Centre, UK",
        date: "Sep 13, 2026",
        time: "Est. 06:30 AM",
        status: "future"
      },
      {
        id: 6,
        title: "Out for Delivery",
        description: "Assigned to London Metropolitan courier route for final business delivery.",
        location: "Bishopsgate, London",
        date: "Sep 14, 2026",
        time: "Est. 10:00 AM",
        status: "future"
      },
      {
        id: 7,
        title: "Delivered",
        description: "Signature and verified photographic proof of receipt at reception desk.",
        location: "London, UK",
        date: "Sep 18, 2026",
        time: "Est. 02:00 PM",
        status: "future"
      }
    ]
  },
  {
    id: "ACE-2026-3M91L4",
    trackingNumber: "ACE-2026-3M91L4",
    status: "DELIVERED",
    statusCode: "delivered",
    method: "Ocean Freight FCL",
    methodType: "ocean",
    origin: "Rotterdam Port, Netherlands",
    destination: "Hamburg Logistics Hub, Germany",
    currentLocation: "Hamburg Logistics Hub, Germany",
    estimatedDelivery: "September 08, 2026",
    createdDate: "2026-08-28",
    customer: "Maersk Logistics BV",
    sender: {
      name: "Jan De Vries",
      company: "Maersk Logistics BV",
      phone: "+31 10 400 1200",
      email: "j.devries@maersklog.nl",
      address: "Willemskade 1, 3016 DK",
      city: "Rotterdam",
      country: "Netherlands"
    },
    receiver: {
      name: "Dieter Schmidt",
      company: "Schmidt Heavy Engineering",
      phone: "+49 40 361 8890",
      email: "d.schmidt@schmidt-eng.de",
      address: "Am Sandtorkai 48, Speicherstadt",
      city: "Hamburg",
      country: "Germany"
    },
    package: {
      type: "Precision Machinery Parts",
      weightKg: 1240.0,
      dimensions: "240 × 120 × 160 cm",
      pieces: 1,
      declaredValue: "$86,000.00",
      insurance: "Marine Cargo Comprehensive",
      sealNumber: "MSKU-882190"
    },
    charges: {
      freight: 1850.00,
      fuelSurcharge: 180.00,
      customsHandling: 120.00,
      total: 2150.00
    },
    timeline: [
      {
        id: 1,
        title: "Shipment Created",
        description: "Container booking registered and customs export declaration processed.",
        location: "Rotterdam, Netherlands",
        date: "Aug 28, 2026",
        time: "08:00 AM",
        status: "completed"
      },
      {
        id: 2,
        title: "Loaded on Vessel",
        description: "Container stowed on vessel ELBSPIRIT at Maasvlakte II container terminal.",
        location: "Port of Rotterdam",
        date: "Aug 30, 2026",
        time: "11:30 PM",
        status: "completed"
      },
      {
        id: 3,
        title: "Arrived at Destination Port",
        description: "Vessel berthed and container unloaded at Hamburg Container Terminal Altenwerder.",
        location: "Port of Hamburg, Germany",
        date: "Sep 06, 2026",
        time: "07:15 AM",
        status: "completed"
      },
      {
        id: 4,
        title: "Delivered",
        description: "Delivered to receiver warehouse dock. Signed by Dieter Schmidt.",
        location: "Hamburg, Germany",
        date: "Sep 08, 2026",
        time: "03:40 PM",
        status: "completed"
      }
    ]
  },
  {
    id: "ACE-2026-7B42W1",
    trackingNumber: "ACE-2026-7B42W1",
    status: "PENDING",
    statusCode: "pending",
    method: "Ground Freight Express",
    methodType: "road",
    origin: "New York JFK Hub, USA",
    destination: "Chicago O'Hare Depot, USA",
    currentLocation: "New York Distribution Terminal",
    estimatedDelivery: "September 15, 2026",
    createdDate: "2026-09-11",
    customer: "Apex Retail Solutions",
    sender: {
      name: "Marcus Cole",
      company: "Apex Retail Solutions",
      phone: "+1 212 555 4910",
      email: "mcole@apexretail.com",
      address: "85 Broad Street",
      city: "New York",
      country: "USA"
    },
    receiver: {
      name: "Rachel Jenkins",
      company: "Midwest Distribution Hub",
      phone: "+1 312 555 9011",
      email: "rachel.j@midwesthub.com",
      address: "1400 S Lake Shore Dr",
      city: "Chicago",
      country: "USA"
    },
    package: {
      type: "Packaged Commercial Goods",
      weightKg: 310.0,
      dimensions: "120 × 100 × 120 cm",
      pieces: 2,
      declaredValue: "$6,800.00",
      insurance: "Standard Commercial Transit",
      sealNumber: "ACE-US-48201"
    },
    charges: {
      freight: 540.00,
      fuelSurcharge: 60.00,
      customsHandling: 0.00,
      total: 600.00
    },
    timeline: [
      {
        id: 1,
        title: "Shipment Created",
        description: "Booking registered online, bill of lading pending dispatch confirmation.",
        location: "New York, USA",
        date: "Sep 11, 2026",
        time: "04:10 PM",
        status: "completed"
      },
      {
        id: 2,
        title: "Awaiting Carrier Pickup",
        description: "Assigned to ACE Interstate Freightliner fleet truck #10458 for pickup.",
        location: "New York, USA",
        date: "Sep 12, 2026",
        time: "Est. 09:00 AM",
        status: "active"
      },
      {
        id: 3,
        title: "In Transit",
        description: "Overland interstate transport via I-80 W corridor.",
        location: "En Route to Chicago",
        date: "Sep 13, 2026",
        time: "Est. 06:00 PM",
        status: "future"
      },
      {
        id: 4,
        title: "Delivered",
        description: "Final drop-off at Chicago distribution center.",
        location: "Chicago, USA",
        date: "Sep 15, 2026",
        time: "Est. 11:30 AM",
        status: "future"
      }
    ]
  },
  {
    id: "ACE-2026-9P15X8",
    trackingNumber: "ACE-2026-9P15X8",
    status: "IN TRANSIT",
    statusCode: "transit",
    method: "Rail Express Corridor",
    methodType: "rail",
    origin: "Frankfurt Hub, Germany",
    destination: "Warsaw Intermodal Yard, Poland",
    currentLocation: "Dresden Rail Yard (Switching Track 4)",
    estimatedDelivery: "September 14, 2026",
    createdDate: "2026-09-09",
    customer: "Continental Auto Parts",
    sender: {
      name: "Hannah Weber",
      company: "Continental Auto Parts AG",
      phone: "+49 69 881 2004",
      email: "h.weber@continental-auto.de",
      address: "Hanauer Landstrasse 120",
      city: "Frankfurt",
      country: "Germany"
    },
    receiver: {
      name: "Piotr Kowalski",
      company: "Silesia Auto Assembly",
      phone: "+48 22 690 1122",
      email: "p.kowalski@silesia-auto.pl",
      address: "ul. Towarowa 28",
      city: "Warsaw",
      country: "Poland"
    },
    package: {
      type: "EV Battery Modules & Cables",
      weightKg: 850.0,
      dimensions: "180 × 120 × 110 cm",
      pieces: 4,
      declaredValue: "$45,000.00",
      insurance: "Hazmat / Intermodal Rail Certified",
      sealNumber: "RL-VECTRON-6193"
    },
    charges: {
      freight: 1120.00,
      fuelSurcharge: 95.00,
      customsHandling: 0.00,
      total: 1215.00
    },
    timeline: [
      {
        id: 1,
        title: "Shipment Created",
        description: "Rail manifest created with Deutsche Bahn Freight partner.",
        location: "Frankfurt, Germany",
        date: "Sep 09, 2026",
        time: "10:15 AM",
        status: "completed"
      },
      {
        id: 2,
        title: "Loaded on Train Vectron 6193",
        description: "Secured on electric intermodal freight train at Frankfurt-East Yard.",
        location: "Frankfurt-East, Germany",
        date: "Sep 10, 2026",
        time: "07:30 PM",
        status: "completed"
      },
      {
        id: 3,
        title: "In Transit — Rail Junction",
        description: "Passing through Dresden rail corridor towards Polish border checkpoint.",
        location: "Dresden Rail Yard",
        date: "Sep 12, 2026",
        time: "04:15 AM",
        status: "active"
      },
      {
        id: 4,
        title: "Delivered",
        description: "Final shunting to Warsaw intermodal siding.",
        location: "Warsaw, Poland",
        date: "Sep 14, 2026",
        time: "Est. 01:00 PM",
        status: "future"
      }
    ]
  },
  {
    id: "ACE-2026-2K84D3",
    trackingNumber: "ACE-2026-2K84D3",
    status: "CANCELLED",
    statusCode: "cancelled",
    method: "Road Freight",
    methodType: "road",
    origin: "Dubai Logistics City, UAE",
    destination: "Cairo Industrial Zone, Egypt",
    currentLocation: "Dubai JAFZA Free Zone",
    estimatedDelivery: "Cancelled by Shipper",
    createdDate: "2026-09-08",
    customer: "Emirates Trading LLC",
    sender: {
      name: "Tariq Al-Mansoor",
      company: "Emirates Trading LLC",
      phone: "+971 4 881 9900",
      email: "tariq@emiratestrading.ae",
      address: "Warehouse 14B, JAFZA South",
      city: "Dubai",
      country: "UAE"
    },
    receiver: {
      name: "Ahmed Hassan",
      company: "Nile Petrochemicals",
      phone: "+20 2 245 8899",
      email: "ahmed.h@nilepetro.eg",
      address: "Industrial Area 3, 10th of Ramadan",
      city: "Cairo",
      country: "Egypt"
    },
    package: {
      type: "Chemical Additives",
      weightKg: 640.0,
      dimensions: "120 × 120 × 140 cm",
      pieces: 2,
      declaredValue: "$18,500.00",
      insurance: "Cancelled",
      sealNumber: "DXB-CANCEL-01"
    },
    charges: {
      freight: 720.00,
      fuelSurcharge: 80.00,
      customsHandling: 50.00,
      total: 850.00
    },
    timeline: [
      {
        id: 1,
        title: "Shipment Created",
        description: "Booking logged via customer portal.",
        location: "Dubai, UAE",
        date: "Sep 08, 2026",
        time: "11:00 AM",
        status: "completed"
      },
      {
        id: 2,
        title: "Cancelled by Shipper",
        description: "Order cancelled before carrier dispatch due to documentation modification request.",
        location: "Dubai, UAE",
        date: "Sep 09, 2026",
        time: "09:15 AM",
        status: "completed"
      }
    ]
  },
  {
    id: "ACE-2026-5K19T2",
    trackingNumber: "ACE-2026-5K19T2",
    status: "DELIVERED",
    statusCode: "delivered",
    method: "Ocean Container Freight",
    methodType: "ocean",
    origin: "Tema Port, Ghana",
    destination: "Antwerp Port, Belgium",
    currentLocation: "Antwerp Logistics Terminal",
    estimatedDelivery: "September 04, 2026",
    createdDate: "2026-08-18",
    customer: "Kwame Mensah",
    sender: {
      name: "Kwame Mensah",
      company: "Gold Coast Trading Ltd",
      phone: "+233 24 555 0192",
      email: "k.mensah@goldcoasttrading.com",
      address: "Plot 14, Industrial Area, Ring Road Central",
      city: "Accra",
      country: "Ghana"
    },
    receiver: {
      name: "Jean-Pierre Laurent",
      company: "Flanders Food Ingredients BV",
      phone: "+32 3 205 9910",
      email: "jp.laurent@flandersfood.be",
      address: "Haven 1025, Scheldelaan",
      city: "Antwerp",
      country: "Belgium"
    },
    package: {
      type: "Certified Organic Cocoa Butter & Extracts",
      weightKg: 620.0,
      dimensions: "120 × 100 × 140 cm",
      pieces: 2,
      declaredValue: "$18,200.00",
      insurance: "Full Marine Cargo Protection",
      sealNumber: "ACE-SL-77192"
    },
    charges: {
      freight: 920.00,
      fuelSurcharge: 110.00,
      customsHandling: 45.00,
      total: 1075.00
    },
    timeline: [
      {
        id: 1,
        title: "Shipment Created",
        description: "Export documentation approved by Ghana Export Promotion Authority.",
        location: "Tema, Ghana",
        date: "Aug 18, 2026",
        time: "10:00 AM",
        status: "completed"
      },
      {
        id: 2,
        title: "Vessel Loaded",
        description: "Container stowed on board cargo vessel MSC Sandra at Tema Port.",
        location: "Port of Tema",
        date: "Aug 21, 2026",
        time: "03:30 PM",
        status: "completed"
      },
      {
        id: 3,
        title: "Customs Import Clearance",
        description: "Passed Belgian Federal Food Safety Agency and EU customs inspection.",
        location: "Port of Antwerp",
        date: "Sep 03, 2026",
        time: "08:15 AM",
        status: "completed"
      },
      {
        id: 4,
        title: "Delivered",
        description: "Consignment safely delivered and accepted by receiving dock manager.",
        location: "Antwerp, Belgium",
        date: "Sep 04, 2026",
        time: "02:20 PM",
        status: "completed"
      }
    ]
  },
  {
    id: "ACE-2026-4N71P8",
    trackingNumber: "ACE-2026-4N71P8",
    status: "PENDING",
    statusCode: "pending",
    method: "Ground Freight Express",
    methodType: "road",
    origin: "Accra Dispatch Depot, Ghana",
    destination: "Kumasi Industrial Area, Ghana",
    currentLocation: "Accra Dispatch Depot (Awaiting Loading)",
    estimatedDelivery: "September 16, 2026",
    createdDate: "2026-09-12",
    customer: "Kwame Mensah",
    sender: {
      name: "Kwame Mensah",
      company: "Gold Coast Trading Ltd",
      phone: "+233 24 555 0192",
      email: "k.mensah@goldcoasttrading.com",
      address: "Plot 14, Industrial Area, Ring Road Central",
      city: "Accra",
      country: "Ghana"
    },
    receiver: {
      name: "Samuel Osei-Bonsu",
      company: "Ashanti Agro Distribution Ltd",
      phone: "+233 32 202 4410",
      email: "sobonsu@ashantiagro.com.gh",
      address: "Kaasi Industrial Estate, Plot 8",
      city: "Kumasi",
      country: "Ghana"
    },
    package: {
      type: "Agricultural Processing Spare Parts",
      weightKg: 180.0,
      dimensions: "100 × 80 × 75 cm",
      pieces: 2,
      declaredValue: "$4,500.00",
      insurance: "Full ACE Inland Road Transit Cover",
      sealNumber: "ACE-GH-33918"
    },
    charges: {
      freight: 220.00,
      fuelSurcharge: 25.00,
      customsHandling: 0.00,
      total: 245.00
    },
    timeline: [
      {
        id: 1,
        title: "Booking Received & Manifest Confirmed",
        description: "Consignment booked via customer portal and assigned to Accra regional depot.",
        location: "Accra Depot, Ghana",
        date: "Sep 12, 2026",
        time: "08:15 AM",
        status: "completed"
      },
      {
        id: 2,
        title: "Awaiting Truck Loading",
        description: "Package staged at Bay 4 awaiting intercity shuttle transport.",
        location: "Accra Depot, Bay 4",
        date: "Sep 12, 2026",
        time: "11:00 AM",
        status: "active"
      }
    ]
  },
  {
    id: "ACE-2026-6Y83M2",
    trackingNumber: "ACE-2026-6Y83M2",
    status: "IN TRANSIT",
    statusCode: "transit",
    method: "Ocean Freight LCL",
    methodType: "ocean",
    origin: "Rotterdam Port, Netherlands",
    destination: "Port of Felixstowe, UK",
    currentLocation: "North Sea (Feeder Vessel ACE PIONEER)",
    estimatedDelivery: "September 15, 2026",
    createdDate: "2026-09-11",
    customer: "Maersk Logistics BV",
    sender: {
      name: "Jan De Vries",
      company: "Maersk Logistics BV",
      phone: "+31 10 400 1200",
      email: "j.devries@maersklog.nl",
      address: "Willemskade 1, 3016 DK",
      city: "Rotterdam",
      country: "Netherlands"
    },
    receiver: {
      name: "Arthur Pendelton",
      company: "Suffolk Maritime Imports Ltd",
      phone: "+44 1394 604 500",
      email: "arthur.p@suffolkmaritime.co.uk",
      address: "Dock Gate 2, Port of Felixstowe",
      city: "Felixstowe",
      country: "United Kingdom"
    },
    package: {
      type: "Palletized Hydraulic Valve Systems",
      weightKg: 850.0,
      dimensions: "120 × 100 × 110 cm",
      pieces: 1,
      declaredValue: "$34,200.00",
      insurance: "Full Marine All-Risk Cover",
      sealNumber: "MSKU-994102"
    },
    charges: {
      freight: 760.00,
      fuelSurcharge: 85.00,
      customsHandling: 65.00,
      total: 910.00
    },
    timeline: [
      {
        id: 1,
        title: "Consignment Dispatched from Rotterdam",
        description: "LCL consolidation completed and loaded onto feeder vessel ACE PIONEER.",
        location: "Port of Rotterdam",
        date: "Sep 11, 2026",
        time: "07:00 PM",
        status: "completed"
      },
      {
        id: 2,
        title: "En Route North Sea",
        description: "Vessel in transit across the North Sea toward Felixstowe berth 8.",
        location: "North Sea Route",
        date: "Sep 12, 2026",
        time: "06:30 AM",
        status: "active"
      }
    ]
  }
];

export const USERS_LIST = [
  { 
    id: "usr-1", 
    name: "David Sterling", 
    email: "d.sterling@acelogistics.com", 
    loginPassword: "AdminSecurePass#2026", 
    role: "Admin", 
    department: "Global Operations Command", 
    status: "Active", 
    lastLogin: "2 mins ago",
    accessScope: "Full All-Portals Executive Authority (Privileged to view staff & customer login details)",
    phone: "+44 20 7946 0100"
  },
  { 
    id: "usr-2", 
    name: "Sarah O'Connor", 
    email: "s.oconnor@acelogistics.com", 
    loginPassword: "StaffDispatchKey@99", 
    role: "Staff", 
    department: "Terminal Dispatch (LHR)", 
    status: "Active", 
    lastLogin: "14 mins ago",
    accessScope: "Terminal Dispatcher & Customer Console Only",
    phone: "+44 20 7946 0199"
  },
  { 
    id: "usr-3", 
    name: "Kwame Mensah", 
    email: "k.mensah@goldcoasttrading.com", 
    loginPassword: "KwameTrading#Accra24", 
    role: "Customer", 
    department: "Gold Coast Trading Ltd", 
    status: "Active", 
    lastLogin: "1 hour ago",
    accessScope: "Personal Shipments & Telemetry Records Only",
    phone: "+233 24 555 0192"
  },
  { 
    id: "usr-4", 
    name: "Jan De Vries", 
    email: "j.devries@maersklog.nl", 
    loginPassword: "MaerskRotterdamPass@82", 
    role: "Customer", 
    department: "Maersk Logistics BV", 
    status: "Active", 
    lastLogin: "Yesterday",
    accessScope: "Personal Shipments & Telemetry Records Only",
    phone: "+31 10 400 1200"
  },
  { 
    id: "usr-5", 
    name: "Robert Mensah", 
    email: "r.mensah@acelogistics.com", 
    loginPassword: "KotokaDispatcher#44", 
    role: "Staff", 
    department: "Kotoka Air Terminal Dispatch", 
    status: "Active", 
    lastLogin: "3 hours ago",
    accessScope: "Terminal Dispatcher & Customer Console Only",
    phone: "+233 24 555 0811"
  },
  { 
    id: "usr-6", 
    name: "Elena Rostova", 
    email: "e.rostova@acelogistics.com", 
    loginPassword: "CustomsDeskPass#17", 
    role: "Staff", 
    department: "Customs Compliance & Bonded Yard", 
    status: "Inactive", 
    lastLogin: "5 days ago",
    accessScope: "Terminal Dispatcher & Customer Console Only",
    phone: "+31 10 400 1255"
  }
];

export const KNOWN_ACCOUNTS = [
  {
    name: "Kwame Mensah",
    email: "k.mensah@goldcoasttrading.com",
    company: "Gold Coast Trading Ltd",
    phone: "+233 24 555 0192",
    city: "Accra",
    country: "Ghana",
    address: "Plot 14, Industrial Area, Ring Road Central",
    role: "customer"
  },
  {
    name: "Jan De Vries",
    email: "j.devries@maersklog.nl",
    company: "Maersk Logistics BV",
    phone: "+31 10 400 1200",
    city: "Rotterdam",
    country: "Netherlands",
    address: "Willemskade 1, 3016 DK",
    role: "customer"
  },
  {
    name: "Marcus Cole",
    email: "mcole@apexretail.com",
    company: "Apex Retail Solutions",
    phone: "+1 212 555 4910",
    city: "New York",
    country: "USA",
    address: "85 Broad Street",
    role: "customer"
  },
  {
    name: "Sarah O'Connor",
    email: "s.oconnor@acelogistics.com",
    company: "ACE Logistics Dispatch Hub (LHR)",
    phone: "+44 20 7946 0199",
    city: "London",
    country: "UK",
    role: "staff"
  },
  {
    name: "David Sterling",
    email: "d.sterling@acelogistics.com",
    company: "ACE Logistics Global Operations",
    phone: "+44 20 7946 0100",
    city: "London",
    country: "UK",
    role: "admin"
  }
];

// Pure helper function to verify if a shipment belongs specifically to a given customer
export function isShipmentForCustomer(shipment, user) {
  if (!shipment || !user) return false;

  const userEmail = (user.email || '').trim().toLowerCase();
  const userName = (user.name || '').trim().toLowerCase();
  const userCompany = (user.company || '').trim().toLowerCase();

  // 1. Direct customer property on shipment
  const cust = (shipment.customer || '').trim().toLowerCase();
  if (userCompany && (cust === userCompany || cust.includes(userCompany))) return true;
  if (userName && (cust === userName || cust.includes(userName))) return true;

  // 2. Sender email, name, or company match
  const senderEmail = (shipment.sender?.email || '').trim().toLowerCase();
  const senderName = (shipment.sender?.name || '').trim().toLowerCase();
  const senderCompany = (shipment.sender?.company || '').trim().toLowerCase();

  if (userEmail && senderEmail === userEmail) return true;
  if (userName && (senderName === userName || senderName.includes(userName))) return true;
  if (userCompany && (senderCompany === userCompany || senderCompany.includes(userCompany))) return true;

  // 3. Receiver email, name, or company match (inbound deliveries for this customer)
  const receiverEmail = (shipment.receiver?.email || '').trim().toLowerCase();
  const receiverName = (shipment.receiver?.name || '').trim().toLowerCase();
  const receiverCompany = (shipment.receiver?.company || '').trim().toLowerCase();

  if (userEmail && receiverEmail === userEmail) return true;
  if (userName && (receiverName === userName || receiverName.includes(userName))) return true;
  if (userCompany && (receiverCompany === userCompany || receiverCompany.includes(userCompany))) return true;

  return false;
}
