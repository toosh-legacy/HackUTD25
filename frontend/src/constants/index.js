export const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Major cities with coordinates for map display
export const CITIES = [
  // Alabama
  { id: 'birmingham', name: 'Birmingham', state: 'Alabama', coordinates: [-86.8025, 33.5207] },
  // Alaska
  { id: 'anchorage', name: 'Anchorage', state: 'Alaska', coordinates: [-149.9003, 61.2181] },
  // Arizona
  { id: 'phoenix', name: 'Phoenix', state: 'Arizona', coordinates: [-112.0740, 33.4484] },
  { id: 'tucson', name: 'Tucson', state: 'Arizona', coordinates: [-110.9747, 32.2226] },
  // Arkansas
  { id: 'little-rock', name: 'Little Rock', state: 'Arkansas', coordinates: [-92.2896, 34.7465] },
  // California
  { id: 'los-angeles', name: 'Los Angeles', state: 'California', coordinates: [-118.2437, 34.0522] },
  { id: 'san-francisco', name: 'San Francisco', state: 'California', coordinates: [-122.4194, 37.7749] },
  { id: 'san-diego', name: 'San Diego', state: 'California', coordinates: [-117.1611, 32.7157] },
  { id: 'sacramento', name: 'Sacramento', state: 'California', coordinates: [-121.4944, 38.5816] },
  { id: 'san-jose', name: 'San Jose', state: 'California', coordinates: [-121.8863, 37.3382] },
  // Colorado
  { id: 'denver', name: 'Denver', state: 'Colorado', coordinates: [-104.9903, 39.7392] },
  { id: 'colorado-springs', name: 'Colorado Springs', state: 'Colorado', coordinates: [-104.8214, 38.8339] },
  // Connecticut
  { id: 'hartford', name: 'Hartford', state: 'Connecticut', coordinates: [-72.6851, 41.7658] },
  // Delaware
  { id: 'wilmington', name: 'Wilmington', state: 'Delaware', coordinates: [-75.5398, 39.7391] },
  // Florida
  { id: 'miami', name: 'Miami', state: 'Florida', coordinates: [-80.1918, 25.7617] },
  { id: 'orlando', name: 'Orlando', state: 'Florida', coordinates: [-81.3792, 28.5383] },
  { id: 'tampa', name: 'Tampa', state: 'Florida', coordinates: [-82.4572, 27.9506] },
  { id: 'jacksonville', name: 'Jacksonville', state: 'Florida', coordinates: [-81.6557, 30.3322] },
  // Georgia
  { id: 'atlanta', name: 'Atlanta', state: 'Georgia', coordinates: [-84.3880, 33.7490] },
  // Hawaii
  { id: 'honolulu', name: 'Honolulu', state: 'Hawaii', coordinates: [-157.8583, 21.3099] },
  // Idaho
  { id: 'boise', name: 'Boise', state: 'Idaho', coordinates: [-116.2146, 43.6150] },
  // Illinois
  { id: 'chicago', name: 'Chicago', state: 'Illinois', coordinates: [-87.6298, 41.8781] },
  // Indiana
  { id: 'indianapolis', name: 'Indianapolis', state: 'Indiana', coordinates: [-86.1581, 39.7684] },
  // Iowa
  { id: 'des-moines', name: 'Des Moines', state: 'Iowa', coordinates: [-93.6091, 41.5868] },
  // Kansas
  { id: 'wichita', name: 'Wichita', state: 'Kansas', coordinates: [-97.3301, 37.6872] },
  { id: 'kansas-city', name: 'Kansas City', state: 'Kansas', coordinates: [-94.5786, 39.0997] },
  // Kentucky
  { id: 'louisville', name: 'Louisville', state: 'Kentucky', coordinates: [-85.7585, 38.2527] },
  // Louisiana
  { id: 'new-orleans', name: 'New Orleans', state: 'Louisiana', coordinates: [-90.0715, 29.9511] },
  // Maine
  { id: 'portland-me', name: 'Portland', state: 'Maine', coordinates: [-70.2553, 43.6591] },
  // Maryland
  { id: 'baltimore', name: 'Baltimore', state: 'Maryland', coordinates: [-76.6122, 39.2904] },
  // Massachusetts
  { id: 'boston', name: 'Boston', state: 'Massachusetts', coordinates: [-71.0589, 42.3601] },
  // Michigan
  { id: 'detroit', name: 'Detroit', state: 'Michigan', coordinates: [-83.0458, 42.3314] },
  // Minnesota
  { id: 'minneapolis', name: 'Minneapolis', state: 'Minnesota', coordinates: [-93.2650, 44.9778] },
  // Mississippi
  { id: 'jackson', name: 'Jackson', state: 'Mississippi', coordinates: [-90.1848, 32.2988] },
  // Missouri
  { id: 'kansas-city-mo', name: 'Kansas City', state: 'Missouri', coordinates: [-94.5786, 39.0997] },
  { id: 'st-louis', name: 'St. Louis', state: 'Missouri', coordinates: [-90.1994, 38.6270] },
  // Montana
  { id: 'billings', name: 'Billings', state: 'Montana', coordinates: [-108.5007, 45.7833] },
  // Nebraska
  { id: 'omaha', name: 'Omaha', state: 'Nebraska', coordinates: [-95.9345, 41.2565] },
  // Nevada
  { id: 'las-vegas', name: 'Las Vegas', state: 'Nevada', coordinates: [-115.1398, 36.1699] },
  { id: 'reno', name: 'Reno', state: 'Nevada', coordinates: [-119.8138, 39.5296] },
  // New Hampshire
  { id: 'manchester', name: 'Manchester', state: 'New Hampshire', coordinates: [-71.5376, 42.9956] },
  // New Jersey
  { id: 'newark', name: 'Newark', state: 'New Jersey', coordinates: [-74.1724, 40.7357] },
  // New Mexico
  { id: 'albuquerque', name: 'Albuquerque', state: 'New Mexico', coordinates: [-106.6504, 35.0844] },
  // New York
  { id: 'new-york', name: 'New York', state: 'New York', coordinates: [-74.0060, 40.7128] },
  { id: 'buffalo', name: 'Buffalo', state: 'New York', coordinates: [-78.8784, 42.8864] },
  // North Carolina
  { id: 'charlotte', name: 'Charlotte', state: 'North Carolina', coordinates: [-80.8431, 35.2271] },
  { id: 'raleigh', name: 'Raleigh', state: 'North Carolina', coordinates: [-78.6382, 35.7796] },
  // North Dakota
  { id: 'fargo', name: 'Fargo', state: 'North Dakota', coordinates: [-96.7898, 46.8772] },
  // Ohio
  { id: 'columbus', name: 'Columbus', state: 'Ohio', coordinates: [-82.9988, 39.9612] },
  { id: 'cleveland', name: 'Cleveland', state: 'Ohio', coordinates: [-81.6944, 41.4993] },
  // Oklahoma
  { id: 'oklahoma-city', name: 'Oklahoma City', state: 'Oklahoma', coordinates: [-97.5164, 35.4676] },
  // Oregon
  { id: 'portland', name: 'Portland', state: 'Oregon', coordinates: [-122.6765, 45.5231] },
  // Pennsylvania
  { id: 'philadelphia', name: 'Philadelphia', state: 'Pennsylvania', coordinates: [-75.1652, 39.9526] },
  { id: 'pittsburgh', name: 'Pittsburgh', state: 'Pennsylvania', coordinates: [-79.9959, 40.4406] },
  // Rhode Island
  { id: 'providence', name: 'Providence', state: 'Rhode Island', coordinates: [-71.4128, 41.8240] },
  // South Carolina
  { id: 'charleston', name: 'Charleston', state: 'South Carolina', coordinates: [-79.9311, 32.7765] },
  { id: 'columbia', name: 'Columbia', state: 'South Carolina', coordinates: [-81.0348, 34.0007] },
  // South Dakota
  { id: 'sioux-falls', name: 'Sioux Falls', state: 'South Dakota', coordinates: [-96.7003, 43.5446] },
  // Tennessee
  { id: 'nashville', name: 'Nashville', state: 'Tennessee', coordinates: [-86.7816, 36.1627] },
  { id: 'memphis', name: 'Memphis', state: 'Tennessee', coordinates: [-90.0490, 35.1495] },
  // Texas
  { id: 'houston', name: 'Houston', state: 'Texas', coordinates: [-95.3698, 29.7604] },
  { id: 'dallas', name: 'Dallas', state: 'Texas', coordinates: [-96.7970, 32.7767] },
  { id: 'austin', name: 'Austin', state: 'Texas', coordinates: [-97.7431, 30.2672] },
  { id: 'san-antonio', name: 'San Antonio', state: 'Texas', coordinates: [-98.4936, 29.4241] },
  // Utah
  { id: 'salt-lake-city', name: 'Salt Lake City', state: 'Utah', coordinates: [-111.8910, 40.7608] },
  // Vermont
  { id: 'burlington', name: 'Burlington', state: 'Vermont', coordinates: [-73.2121, 44.4759] },
  // Virginia
  { id: 'virginia-beach', name: 'Virginia Beach', state: 'Virginia', coordinates: [-75.9780, 36.8529] },
  { id: 'richmond', name: 'Richmond', state: 'Virginia', coordinates: [-77.4360, 37.5407] },
  // Washington
  { id: 'seattle', name: 'Seattle', state: 'Washington', coordinates: [-122.3321, 47.6062] },
  { id: 'spokane', name: 'Spokane', state: 'Washington', coordinates: [-117.4260, 47.6588] },
  // Washington DC
  { id: 'washington-dc', name: 'Washington DC', state: 'District of Columbia', coordinates: [-77.0369, 38.9072] },
  // West Virginia
  { id: 'charleston-wv', name: 'Charleston', state: 'West Virginia', coordinates: [-81.6326, 38.3498] },
  // Wisconsin
  { id: 'milwaukee', name: 'Milwaukee', state: 'Wisconsin', coordinates: [-87.9065, 43.0389] },
  // Wyoming
  { id: 'cheyenne', name: 'Cheyenne', state: 'Wyoming', coordinates: [-104.8202, 41.1400] },
];

export const PROBLEM_CATEGORIES = [
  'Mobile Phone',
  '5G Home Internet',
  'No Signal',
  'Website',
  'TV Streaming',
  'Total Blackout',
  'Texting',
  'T-Life App',
  'Mobile Internet',
  'Mobile App',
  'Email'
];