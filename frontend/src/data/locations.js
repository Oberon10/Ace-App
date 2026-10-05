// Global Logistics Network Locations: Countries and Major Commercial / Port Cities
export const COUNTRIES_AND_CITIES = {
  "Ghana": [
    "Accra",
    "Tema",
    "Kumasi",
    "Takoradi",
    "Tamale",
    "Sunyani",
    "Cape Coast",
    "Koforidua",
    "Ho",
    "Wa"
  ],
  "Nigeria": [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Kano",
    "Ibadan",
    "Benin City",
    "Warri",
    "Calabar",
    "Enugu",
    "Kaduna"
  ],
  "United Kingdom": [
    "London",
    "Manchester",
    "Birmingham",
    "Liverpool",
    "Glasgow",
    "Edinburgh",
    "Bristol",
    "Southampton",
    "Leeds",
    "Newcastle"
  ],
  "United States": [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami",
    "Atlanta",
    "San Francisco",
    "Dallas",
    "Seattle",
    "Boston",
    "Philadelphia",
    "Detroit"
  ],
  "Netherlands": [
    "Rotterdam",
    "Amsterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Tilburg",
    "Groningen"
  ],
  "Germany": [
    "Frankfurt",
    "Hamburg",
    "Berlin",
    "Munich",
    "Cologne",
    "Dusseldorf",
    "Stuttgart",
    "Leipzig",
    "Bremen"
  ],
  "China": [
    "Shanghai",
    "Shenzhen",
    "Guangzhou",
    "Beijing",
    "Ningbo",
    "Hong Kong",
    "Tianjin",
    "Qingdao",
    "Xiamen",
    "Chengdu"
  ],
  "United Arab Emirates": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Jebel Ali",
    "Ajman",
    "Ras Al Khaimah"
  ],
  "Singapore": [
    "Singapore"
  ],
  "Belgium": [
    "Antwerp",
    "Brussels",
    "Ghent",
    "Liege",
    "Bruges",
    "Charleroi"
  ],
  "France": [
    "Paris",
    "Marseille",
    "Lyon",
    "Le Havre",
    "Toulouse",
    "Bordeaux",
    "Lille",
    "Nice",
    "Strasbourg"
  ],
  "Canada": [
    "Toronto",
    "Vancouver",
    "Montreal",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Halifax"
  ],
  "Australia": [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Fremantle"
  ],
  "Brazil": [
    "São Paulo",
    "Rio de Janeiro",
    "Santos",
    "Brasília",
    "Curitiba",
    "Salvador"
  ],
  "Côte d'Ivoire": [
    "Abidjan",
    "Yamoussoukro",
    "San-Pédro",
    "Bouaké",
    "Korhogo"
  ],
  "Egypt": [
    "Cairo",
    "Alexandria",
    "Port Said",
    "Giza",
    "Suez",
    "Luxor",
    "Aswan"
  ],
  "Ethiopia": [
    "Addis Ababa",
    "Dire Dawa",
    "Hawassa",
    "Bahir Dar"
  ],
  "India": [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Ahmedabad",
    "Pune"
  ],
  "Italy": [
    "Rome",
    "Milan",
    "Genoa",
    "Naples",
    "Turin",
    "Florence",
    "Venice",
    "Bologna"
  ],
  "Japan": [
    "Tokyo",
    "Yokohama",
    "Osaka",
    "Nagoya",
    "Kobe",
    "Fukuoka",
    "Sapporo"
  ],
  "Kenya": [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Malindi"
  ],
  "Mexico": [
    "Mexico City",
    "Guadalajara",
    "Monterrey",
    "Veracruz",
    "Tijuana",
    "Manzanillo"
  ],
  "Morocco": [
    "Casablanca",
    "Tangier",
    "Rabat",
    "Marrakech",
    "Agadir",
    "Fez"
  ],
  "Qatar": [
    "Doha",
    "Al Wakrah",
    "Al Rayyan",
    "Mesaieed",
    "Ras Laffan"
  ],
  "Rwanda": [
    "Kigali",
    "Butare",
    "Gisenyi",
    "Ruhengeri"
  ],
  "Saudi Arabia": [
    "Riyadh",
    "Jeddah",
    "Dammam",
    "Mecca",
    "Medina",
    "Khobar",
    "Jubail"
  ],
  "Senegal": [
    "Dakar",
    "Thiès",
    "Touba",
    "Saint-Louis",
    "Kaolack"
  ],
  "South Africa": [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "East London"
  ],
  "South Korea": [
    "Seoul",
    "Busan",
    "Incheon",
    "Daegu",
    "Daejeon",
    "Gwangju"
  ],
  "Spain": [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Seville",
    "Bilbao",
    "Malaga",
    "Zaragoza"
  ],
  "Switzerland": [
    "Zurich",
    "Geneva",
    "Basel",
    "Bern",
    "Lausanne",
    "Lucerne"
  ],
  "Togo": [
    "Lomé",
    "Sokodé",
    "Kara",
    "Kpalimé",
    "Atakpamé"
  ],
  "Turkey": [
    "Istanbul",
    "Ankara",
    "Izmir",
    "Bursa",
    "Antalya",
    "Mersin"
  ]
};

// Sorted list of all countries
export const COUNTRY_LIST = Object.keys(COUNTRIES_AND_CITIES).sort((a, b) => a.localeCompare(b));

// Helper to get cities for a given country
export const getCitiesForCountry = (countryName) => {
  if (!countryName || !COUNTRIES_AND_CITIES[countryName]) {
    return [];
  }
  return COUNTRIES_AND_CITIES[countryName];
};
