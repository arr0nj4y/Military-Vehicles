// Seed data for the ArmoredHub catalog.
// Field keys match the original app's schema exactly:
// name, category, country, era, image_url, top_speed, range, crew, weight,
// armament, description, admin_note, is_active.

export const CATEGORIES = [
  'Main Battle Tank',
  'Infantry Fighting Vehicle',
  'Armored Personnel Carrier',
  'Self-Propelled Artillery',
  'Reconnaissance',
  'Air Defense',
]

export const ERAS = ['WWII', 'Cold War', 'Modern']

export const MOCK_VEHICLES = [
  {
    id: 'v-m1a2',
    name: 'M1A2 Abrams',
    category: 'Main Battle Tank',
    country: 'USA',
    era: 'Modern',
    image_url:
      'https://images.unsplash.com/photo-1569060368317-8f9b1e5f8b8b?w=800&q=80',
    top_speed: '67 km/h',
    range: '426 km',
    crew: '4',
    weight: '62 tons',
    armament: '120mm M256 smoothbore gun, 2x 7.62mm, 1x 12.7mm',
    description:
      'The M1A2 Abrams is the main battle tank of the United States Army, featuring advanced composite armor, a 120mm smoothbore cannon, and a gas-turbine engine.',
    admin_note: 'Export variant restrictions apply. Verify FMS documentation.',
    is_active: true,
  },
  {
    id: 'v-leopard2',
    name: 'Leopard 2A7',
    category: 'Main Battle Tank',
    country: 'Germany',
    era: 'Modern',
    image_url:
      'https://images.unsplash.com/photo-1602524206684-8b7f2f5b0f1a?w=800&q=80',
    top_speed: '68 km/h',
    range: '450 km',
    crew: '4',
    weight: '67 tons',
    armament: '120mm Rheinmetall L/55 smoothbore gun, 2x 7.62mm MG3',
    description:
      'The Leopard 2A7 is a third-generation German main battle tank, widely regarded for its firepower, protection, and mobility across NATO forces.',
    admin_note: '',
    is_active: true,
  },
  {
    id: 'v-t90m',
    name: 'T-90M Proryv',
    category: 'Main Battle Tank',
    country: 'Russia',
    era: 'Modern',
    image_url:
      'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?w=800&q=80',
    top_speed: '60 km/h',
    range: '550 km',
    crew: '3',
    weight: '48 tons',
    armament: '125mm 2A46M-5 smoothbore gun, Kord 12.7mm, PKTM 7.62mm',
    description:
      'The T-90M is a modernized Russian main battle tank with the Relikt explosive reactive armor package and an upgraded fire-control system.',
    admin_note: '',
    is_active: true,
  },
  {
    id: 'v-bradley',
    name: 'M2A3 Bradley',
    category: 'Infantry Fighting Vehicle',
    country: 'USA',
    era: 'Cold War',
    image_url:
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80',
    top_speed: '66 km/h',
    range: '400 km',
    crew: '3 + 6 troops',
    weight: '27 tons',
    armament: '25mm M242 Bushmaster, TOW missile launcher, 7.62mm coax',
    description:
      'The M2 Bradley is a tracked infantry fighting vehicle that transports a squad while providing fire support with its autocannon and anti-tank missiles.',
    admin_note: '',
    is_active: true,
  },
  {
    id: 'v-bmp3',
    name: 'BMP-3',
    category: 'Infantry Fighting Vehicle',
    country: 'Russia',
    era: 'Cold War',
    image_url:
      'https://images.unsplash.com/photo-1541443131876-44b03a2b0b0f?w=800&q=80',
    top_speed: '70 km/h',
    range: '600 km',
    crew: '3 + 7 troops',
    weight: '18.7 tons',
    armament: '100mm 2A70 gun, 30mm 2A72 autocannon, 3x 7.62mm PKT',
    description:
      'The BMP-3 is a Soviet-designed amphibious infantry fighting vehicle with a uniquely heavy mixed-caliber armament package for its class.',
    admin_note: '',
    is_active: true,
  },
  {
    id: 'v-stryker',
    name: 'M1126 Stryker',
    category: 'Armored Personnel Carrier',
    country: 'USA',
    era: 'Modern',
    image_url:
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800&q=80',
    top_speed: '100 km/h',
    range: '500 km',
    crew: '2 + 9 troops',
    weight: '18 tons',
    armament: '12.7mm M2 or 40mm Mk19 grenade launcher (RWS)',
    description:
      'The Stryker is an eight-wheeled armored personnel carrier providing rapid, protected mobility for infantry squads on the modern battlefield.',
    admin_note: '',
    is_active: true,
  },
  {
    id: 'v-paladin',
    name: 'M109A7 Paladin',
    category: 'Self-Propelled Artillery',
    country: 'USA',
    era: 'Modern',
    image_url:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    top_speed: '61 km/h',
    range: '300 km',
    crew: '4',
    weight: '36 tons',
    armament: '155mm M284 howitzer, 12.7mm M2 machine gun',
    description:
      'The M109A7 Paladin is a self-propelled 155mm howitzer providing indirect fire support with improved survivability and automated loading.',
    admin_note: '',
    is_active: true,
  },
  {
    id: 'v-tiger',
    name: 'Tiger I',
    category: 'Main Battle Tank',
    country: 'Germany',
    era: 'WWII',
    image_url:
      'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&q=80',
    top_speed: '45 km/h',
    range: '195 km',
    crew: '5',
    weight: '57 tons',
    armament: '88mm KwK 36 L/56 gun, 2x 7.92mm MG 34',
    description:
      'The Tiger I was a German heavy tank of World War II, renowned for its powerful 88mm gun and thick frontal armor that dominated early engagements.',
    admin_note: 'Historical reference entry — not in active service.',
    is_active: true,
  },
]
