/**
 * Script to generate 1000+ sample poops for testing
 * Region: Lazio (Rome area)
 */

// Lazio coordinates (Rome and surroundings)
const LAZIO_BOUNDS = {
  lat: { min: 41.85, max: 42.05 },
  lng: { min: 12.35, max: 12.65 }
};

// Sample data
const TYPES = ['healthy', 'soft', 'diarrhea', 'hard', 'blood', 'mucus'];
const SIZES = ['small', 'medium', 'large'];
const COLORS = ['normal', 'light', 'dark', 'green', 'yellow', 'red'];
const SMELLS = ['normal', 'strong', 'unusual'];

const FOODS = [
  'Crocchette al pollo',
  'Crocchette al manzo',
  'Carne cruda',
  'Pollo bollito',
  'Riso e pollo',
  'Cibo umido al salmone',
  'Crocchette grain-free',
  'Verdure miste',
  'Agnello e riso',
  'Pesce bianco',
  'Tacchino',
  'Cibo dietetico',
  'Snack naturali',
  'Bocconcini al manzo'
];

const NOTES = [
  'Il cane sembrava tranquillo',
  'Ha mangiato bene stamattina',
  'Molto attivo durante la passeggiata',
  'Un po\' nervoso',
  'Sembrava avere fretta',
  'Passeggiata al parco',
  'Dopo aver giocato con altri cani',
  'Prima del pasto serale',
  'Dopo la corsa',
  'Normale evacuazione',
  'Ha bevuto molta acqua',
  'Giornata calda',
  'Dopo il veterinario',
  'Cambio di alimentazione recente',
  'Tutto regolare',
  null, null, null // Some without notes
];

// Generate random value in range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate random date in last 6 months
function randomDate() {
  const now = Date.now();
  const sixMonthsAgo = now - (180 * 24 * 60 * 60 * 1000);
  return new Date(randomInRange(sixMonthsAgo, now)).toISOString();
}

// Generate random item from array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random coordinates in Lazio
function randomCoordinates() {
  return {
    lat: randomInRange(LAZIO_BOUNDS.lat.min, LAZIO_BOUNDS.lat.max),
    lng: randomInRange(LAZIO_BOUNDS.lng.min, LAZIO_BOUNDS.lng.max)
  };
}

// Generate poops
function generatePoops(count) {
  const poops = [];

  for (let i = 0; i < count; i++) {
    const coords = randomCoordinates();
    const timestamp = randomDate();
    const type = randomItem(TYPES);
    const food = randomItem(FOODS);
    const notes = randomItem(NOTES);

    const poop = {
      id: Date.now() + i + Math.random().toString(36).substr(2, 9),
      lat: coords.lat,
      lng: coords.lng,
      timestamp: timestamp,
      type: type,
      size: randomItem(SIZES),
      color: randomItem(COLORS),
      smell: randomItem(SMELLS),
      food: food,
      hoursSinceMeal: Math.floor(Math.random() * 12) + 1,
      notes: notes,
      isManual: Math.random() > 0.8 // 20% manual entries
    };

    poops.push(poop);
  }

  return poops;
}

// Generate sample dog profile
const dogProfile = {
  name: 'Bobby',
  dogBirthdate: '2020-05-15',
  dogWeight: '15.5',
  dogBreed: 'Labrador Retriever',
  dogGender: 'male',
  dogColor: 'Marrone chiaro',
  dogMicrochip: '380260000123456',
  dogChronicDiseases: '',
  dogFoodAllergies: 'Glutine',
  dogMedicineAllergies: '',
  dogCurrentMedicine: '',
  dogSurgeries: 'Sterilizzazione (2021)',
  vetName: 'Clinica Veterinaria San Marco',
  vetPhone: '+39 06 12345678',
  vetEmail: 'info@vetroma.it',
  vetAddress: 'Via Roma 123, Roma',
  lastVaccination: '2025-06-15',
  nextVaccination: '2026-06-15',
  lastAntiparasitic: '2025-10-01',
  nextAntiparasitic: '2026-01-01',
  lastFleaTick: '2025-11-01',
  nextFleaTick: '2026-02-01',
  vaccinationNotes: 'Vaccino pentavalente annuale',
  dogGeneralNotes: 'Cane molto socievole e attivo. Adora giocare al parco.'
};

// Generate backup file
const backup = {
  version: '2.0.0',
  timestamp: new Date().toISOString(),
  poops: generatePoops(1200), // Generate 1200 poops
  dogProfile: dogProfile,
  dogPhoto: null,
  savedNotes: [
    'Il cane sembrava tranquillo',
    'Molto attivo durante la passeggiata',
    'Passeggiata al parco',
    'Tutto regolare'
  ],
  foodHistory: FOODS,
  mapSettings: {
    zoom: 16,
    autoCenter: true
  }
};

// Output JSON
console.log(JSON.stringify(backup, null, 2));
