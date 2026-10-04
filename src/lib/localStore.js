const STORAGE_KEY = "cropiq-demo-store";
const USER_KEY = "cropiq-demo-user";

const demoUser = {
  id: "demo-user",
  full_name: "Demo Farmer",
  name: "Demo Farmer",
  email: "demo@cropiq.local",
  farm_name: "Green Valley Farm",
  phone: "",
  preferred_language: "english",
  farm_size_acres: 3.7,
  experience_years: 4,
  primary_crops: ["Tomato", "Corn"],
  location: { address: "", region: "Telangana", country: "India" },
  notification_preferences: {
    weather_alerts: true,
    pest_disease_alerts: true,
    harvest_reminders: true,
    market_updates: true,
  },
};

const seedData = {
  Crop: [
    {
      id: "crop-1",
      name: "Tomato",
      variety: "Roma",
      planting_date: "2026-06-01",
      expected_harvest_date: "2026-08-15",
      field_size_acres: 1.2,
      growth_stage: "fruiting",
      photo_url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop",
      current_health: "good",
      estimated_yield_kg_per_acre: 2200,
      field_location: "Green Valley Farm",
      notes: "Regular watering schedule maintained",
      created_by: demoUser.email,
      created_date: "2026-06-01T09:00:00.000Z",
    },
    {
      id: "crop-2",
      name: "Corn",
      variety: "Sweet Corn",
      planting_date: "2026-05-15",
      expected_harvest_date: "2026-08-01",
      field_size_acres: 2.5,
      growth_stage: "flowering",
      photo_url: "https://images.unsplash.com/photo-1551754655-cd27e38ad5d9?w=800&h=600&fit=crop",
      current_health: "excellent",
      estimated_yield_kg_per_acre: 1800,
      field_location: "Green Valley Farm",
      notes: "Growing well in sunny conditions",
      created_by: demoUser.email,
      created_date: "2026-05-15T09:00:00.000Z",
    },
  ],
  SoilAnalysis: [
    {
      id: "soil-1",
      photo_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      location: { field_name: "Green Valley Farm" },
      analysis_results: {
        soil_texture: "clay_loam",
        soil_color: "Reddish Brown",
        ph_level: 7.2,
        organic_matter_percent: 2.8,
        nitrogen_ppm: 38,
        phosphorus_ppm: 20,
        potassium_ppm: 160,
        moisture_content: "High",
        drainage_assessment: "Moderate",
        compaction_risk: "Low",
        visible_issues: [],
        suitable_crops: ["Tomato", "Corn", "Chilli"],
        soil_health_score: 88,
      },
      recommendations: [
        { category: "Drainage", recommendation: "Improve drainage in low-lying areas to prevent waterlogging.", priority: "high" },
        { category: "Organic Matter", recommendation: "Add compost or well-decomposed farmyard manure before the next planting cycle.", priority: "medium" },
      ],
      confidence_score: 92,
      explanation: "The soil is suitable for a wide range of crops with good nutrient availability and moderate drainage needs.",
      created_by: demoUser.email,
      created_date: "2026-07-10T09:00:00.000Z",
    },
  ],
  Prediction: [
    {
      id: "prediction-1",
      crop_id: "crop-1",
      prediction_type: "harvest_timing",
      predictions: { optimal_harvest_date: "2026-08-10", harvest_window: "2026-08-07 to 2026-08-15", readiness_indicators: ["fruit color change", "firmness test"] },
      confidence_score: 92,
      recommendations: [
        { action: "Monitor fruit color", timing: "Daily during final week", details: "Harvest when fruits reach the desired maturity stage.", priority: "high" },
        { action: "Prepare harvest equipment", timing: "3 days before harvest", details: "Clean and check picking containers.", priority: "low" },
      ],
      data_sources: ["crop_data", "weather_data", "soil_analysis"],
      explanation: "The crop is progressing well and is approaching its expected harvest window.",
      created_by: demoUser.email,
      created_date: "2026-07-20T09:00:00.000Z",
    },
  ],
  CommunityPost: [
    {
      id: "post-1",
      title: "Organic tomato growing tips",
      content: "What organic practices are working well for tomato flowering and fruit development? Sharing ideas can help everyone improve yields.",
      category: "discussion",
      crop_related: "tomato",
      location: "Telangana",
      images: [],
      likes_count: 12,
      comments_count: 4,
      is_marketplace: false,
      marketplace_details: null,
      tags: ["tomato", "organic", "tips"],
      created_by: demoUser.email,
      created_date: "2026-07-18T09:00:00.000Z",
    },
    {
      id: "post-2",
      title: "Fresh vegetables available",
      content: "Fresh farm produce available for local buyers. Contact the community moderator for marketplace details.",
      category: "marketplace_sell",
      crop_related: "vegetables",
      location: "Telangana",
      images: [],
      likes_count: 8,
      comments_count: 3,
      is_marketplace: true,
      marketplace_details: { price: 3.5, quantity: "500", unit: "kg" },
      tags: ["fresh", "vegetables", "local"],
      created_by: demoUser.email,
      created_date: "2026-07-17T09:00:00.000Z",
    },
  ],
  WeatherData: [
    {
      id: "weather-1",
      location: { city: "Hyderabad", country: "India" },
      current_weather: { temperature_celsius: 28, humidity_percent: 65, wind_speed_kmh: 14, condition: "Partly Cloudy", icon: "partly-cloudy" },
      forecast_7_days: [
        { date: "2026-07-21", high_temp: 31, low_temp: 24, condition: "Sunny", rainfall_mm: 0, icon: "sunny" },
        { date: "2026-07-22", high_temp: 29, low_temp: 23, condition: "Cloudy", rainfall_mm: 3, icon: "cloudy" },
        { date: "2026-07-23", high_temp: 28, low_temp: 23, condition: "Rain", rainfall_mm: 8, icon: "rain" },
      ],
      alerts: [{ type: "rainfall", severity: "moderate", message: "Rain may increase tomorrow. Check field drainage.", start_date: "2026-07-22", end_date: "2026-07-23" }],
      created_date: "2026-07-20T09:00:00.000Z",
    },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

function readStore() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : clone(seedData);
  } catch {
    return clone(seedData);
  }
}

function writeStore(store) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* demo mode */ }
}

export function getUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? { ...demoUser, ...JSON.parse(stored) } : clone(demoUser);
  } catch {
    return clone(demoUser);
  }
}

export function updateUser(data) {
  const next = { ...getUser(), ...clone(data) };
  try { localStorage.setItem(USER_KEY, JSON.stringify(next)); } catch { /* demo mode */ }
  return next;
}

export async function list(entity, sort = "-created_date", limit) {
  const store = readStore();
  let items = clone(store[entity] || []);
  if (sort) {
    const key = sort.replace(/^-/, "");
    items.sort((a, b) => {
      const av = a[key] ?? "";
      const bv = b[key] ?? "";
      return sort.startsWith("-") ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
  }
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function filter(entity, criteria = {}, sort, limit) {
  let items = await list(entity, sort);
  items = items.filter((item) => Object.entries(criteria).every(([key, value]) => item[key] === value));
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function create(entity, data) {
  const store = readStore();
  const item = { ...clone(data), id: data.id || `${entity.toLowerCase()}-${Date.now()}`, created_date: data.created_date || new Date().toISOString(), created_by: data.created_by || getUser().email };
  store[entity] = [item, ...(store[entity] || [])];
  writeStore(store);
  return clone(item);
}

export async function update(entity, id, data) {
  const store = readStore();
  const items = store[entity] || [];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`${entity} record not found`);
  store[entity][index] = { ...items[index], ...clone(data), id };
  writeStore(store);
  return clone(store[entity][index]);
}

export async function remove(entity, id) {
  const store = readStore();
  store[entity] = (store[entity] || []).filter((item) => item.id !== id);
  writeStore(store);
  return true;
}
