// ACE LOGISTICS — SHIPMENTS DATA STORE & MOCK REPOSITORY
// All previous shipments erased per user requirement.
// Only registered consignments created via the system exist.
export const INITIAL_SHIPMENTS = [];

/**
 * Generates an authentic 12-alphanumeric tracking number in standard ACE format:
 * Format: ACE-....-..... (e.g. ACE-2T34-79011)
 * Length: 3 (ACE) + 4 alphanumeric + 5 alphanumeric = 12 characters (excluding hyphens).
 */
export function generateTrackingNumber() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let part1 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  let part2 = '';
  for (let i = 0; i < 5; i++) {
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ACE-${part1}-${part2}`;
}

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
  },
  { 
    id: "usr-7", 
    name: "Marcus Cole", 
    email: "mcole@apexretail.com", 
    loginPassword: "MarcusRetailPass#212", 
    role: "Customer", 
    department: "Apex Retail Solutions", 
    status: "Active", 
    lastLogin: "3 days ago",
    accessScope: "Personal Shipments & Telemetry Records Only",
    phone: "+1 212 555 4910"
  }
];

export const KNOWN_ACCOUNTS = [
  {
    name: "Kwame Mensah",
    email: "k.mensah@goldcoasttrading.com",
    loginPassword: "KwameTrading#Accra24",
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
    loginPassword: "MaerskRotterdamPass@82",
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
    loginPassword: "MarcusRetailPass#212",
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
    loginPassword: "StaffDispatchKey@99",
    company: "ACE Logistics Dispatch Hub (LHR)",
    phone: "+44 20 7946 0199",
    city: "London",
    country: "UK",
    role: "staff"
  },
  {
    name: "David Sterling",
    email: "d.sterling@acelogistics.com",
    loginPassword: "AdminSecurePass#2026",
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
