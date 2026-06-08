/**
 * EliteMotors — Seed Script
 *
 * Creates a dealer account and 6 sample cars with images.
 * Run with:  npm run seed
 */

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const CARS = [
  {
    title: '2024 Mercedes-Benz S-Class S580 — Lagos',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2024,
    price: 125000,
    daily_rate: null,
    mileage: 1200,
    color: 'Obsidian Black',
    description: 'Brand new S580 with Executive Rear Seat Package. Full AMG Line exterior, Burmester 4D surround sound, heated and ventilated seats all around. MBUX with rear tablet control. This is luxury redefined.',
    listing_type: 'sale' as const,
    condition: 'new' as const,
    fuel_type: 'petrol' as const,
    transmission: 'automatic' as const,
    seats: 5,
    doors: 4,
    city: 'Lagos',
    features: ['Panoramic Sunroof', 'Burmester Sound', 'Heated Seats', 'Night Vision', 'Head-Up Display', 'Ambient Lighting'],
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80',
    ],
  },
  {
    title: '2023 BMW X7 xDrive40i — Abuja',
    make: 'BMW',
    model: 'X7',
    year: 2023,
    price: 98000,
    daily_rate: null,
    mileage: 8500,
    color: 'Alpine White',
    description: 'Stunning X7 in Alpine White with Cognac Vernasca leather. M Sport package, driving assistance professional, Bowers & Wilkins diamond surround sound. Third row seating for 7 passengers.',
    listing_type: 'sale' as const,
    condition: 'used' as const,
    fuel_type: 'petrol' as const,
    transmission: 'automatic' as const,
    seats: 7,
    doors: 4,
    city: 'Abuja',
    features: ['M Sport Package', 'Third Row', 'Bowers & Wilkins', 'Panoramic Sky Lounge', 'Gesture Control', 'Parking Assistant'],
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    ],
  },
  {
    title: '2022 Range Rover Sport HSE — Port Harcourt',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2022,
    price: 87000,
    daily_rate: null,
    mileage: 15000,
    color: 'Santorini Black',
    description: 'Range Rover Sport HSE with full leather, meridian sound system, terrain response 2, adaptive dynamics. Perfect for Nigerian roads — combines luxury with capability.',
    listing_type: 'sale' as const,
    condition: 'certified_pre_owned' as const,
    fuel_type: 'diesel' as const,
    transmission: 'automatic' as const,
    seats: 5,
    doors: 4,
    city: 'Port Harcourt',
    features: ['Meridian Sound', 'Terrain Response', 'Adaptive Cruise', 'Air Suspension', 'Leather Interior', 'LED Matrix Lights'],
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    ],
  },
  {
    title: '2024 Toyota Land Cruiser 300 — Daily Rental',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2024,
    price: null,
    daily_rate: 350,
    mileage: 5000,
    color: 'Pearl White',
    description: 'Premium daily rental — the legendary Land Cruiser 300 with twin-turbo V6. Full leather, JBL premium audio, crawl control, multi-terrain select. Perfect for business trips and weekend getaways.',
    listing_type: 'rent' as const,
    condition: 'new' as const,
    fuel_type: 'petrol' as const,
    transmission: 'automatic' as const,
    seats: 7,
    doors: 4,
    city: 'Lagos',
    features: ['JBL Audio', 'Multi-Terrain Select', 'Crawl Control', 'Cooled Seats', 'Wireless Charging', 'Toyota Safety Sense'],
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1625231334168-20a6c1f1e9c2?w=800&q=80',
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&q=80',
    ],
  },
  {
    title: '2023 Porsche Cayenne — Weekend Special',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2023,
    price: null,
    daily_rate: 500,
    mileage: 12000,
    color: 'Carrara White',
    description: 'Experience Porsche for the weekend. Cayenne with Sport Chrono package, PASM adaptive air suspension, 21-inch RS Spyder wheels. BOSE surround sound. An SUV that drives like a sports car.',
    listing_type: 'rent' as const,
    condition: 'used' as const,
    fuel_type: 'petrol' as const,
    transmission: 'automatic' as const,
    seats: 5,
    doors: 4,
    city: 'Lagos',
    features: ['Sport Chrono', 'Air Suspension', 'BOSE Sound', '21" Wheels', 'Sport Exhaust', 'Panoramic Roof'],
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    ],
  },
  {
    title: '2024 Lexus LX 600 — Executive Rental',
    make: 'Lexus',
    model: 'LX 600',
    year: 2024,
    price: null,
    daily_rate: 420,
    mileage: 3000,
    color: 'Sonic Chrome',
    description: 'The flagship Lexus LX 600 in Executive trim — rear seat entertainment, semi-aniline leather, Mark Levinson reference surround sound with 25 speakers. Built on the Land Cruiser platform with refined luxury.',
    listing_type: 'rent' as const,
    condition: 'new' as const,
    fuel_type: 'petrol' as const,
    transmission: 'automatic' as const,
    seats: 7,
    doors: 4,
    city: 'Abuja',
    features: ['Mark Levinson Audio', 'Rear Entertainment', 'Fingerprint Start', 'Heads-Up Display', 'Adaptive Suspension', 'Multi-Terrain Monitor'],
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  console.log('🌱  Seeding database…\n');

  try {
    await client.query('BEGIN');

    // ── 1. Create dealer user ──────────────────────────────────────────
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', ['mubaraklouis@gmail.com']);

    let userId: string;
    let dealerId: string;

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      console.log('  → User already exists, reusing:', userId);

      const existingDealer = await client.query('SELECT id FROM dealers WHERE user_id = $1', [userId]);
      if (existingDealer.rows.length > 0) {
        dealerId = existingDealer.rows[0].id;
        console.log('  → Dealer already exists, reusing:', dealerId);
      } else {
        const dealerRes = await client.query(
          `INSERT INTO dealers (user_id, business_name, description, address, city, country)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [userId, 'Elite Motors Nigeria', 'Premium luxury car dealership based in Lagos. We offer the finest selection of premium and exotic vehicles for sale and rental.', 'Victoria Island', 'Lagos', 'NG']
        );
        dealerId = dealerRes.rows[0].id;
      }
    } else {
      const hash = await bcrypt.hash('12345678', 12);
      const userRes = await client.query(
        `INSERT INTO users (full_name, email, password_hash, role, phone)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        ['Mubarak Louis', 'mubaraklouis@gmail.com', hash, 'dealer', '+250792574679']
      );
      userId = userRes.rows[0].id;
      console.log('  ✅ Created user:', userId);

      const dealerRes = await client.query(
        `INSERT INTO dealers (user_id, business_name, description, address, city, country, rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [userId, 'Elite Motors Nigeria', 'Premium luxury car dealership based in Lagos. We offer the finest selection of premium and exotic vehicles for sale and rental across Nigeria.', 'Victoria Island', 'Lagos', 'NG', 4.8]
      );
      dealerId = dealerRes.rows[0].id;
      console.log('  ✅ Created dealer:', dealerId);
    }

    // ── 2. Delete existing cars from this dealer (clean re-seed) ───────
    await client.query('DELETE FROM cars WHERE dealer_id = $1', [dealerId]);
    console.log('  ✅ Cleared existing listings\n');

    // ── 3. Insert cars and images ─────────────────────────────────────
    for (const car of CARS) {
      const carRes = await client.query(
        `INSERT INTO cars (
          dealer_id, title, make, model, year, price, daily_rate,
          mileage, color, description, listing_type, condition,
          fuel_type, transmission, seats, doors, city, features,
          is_featured, views
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20
        ) RETURNING id`,
        [
          dealerId, car.title, car.make, car.model, car.year, car.price, car.daily_rate,
          car.mileage, car.color, car.description, car.listing_type, car.condition,
          car.fuel_type, car.transmission, car.seats, car.doors, car.city,
          JSON.stringify(car.features),
          car.is_featured,
          Math.floor(Math.random() * 200) + 20, // random views
        ]
      );
      const carId = carRes.rows[0].id;

      // Insert images
      for (let i = 0; i < car.images.length; i++) {
        await client.query(
          `INSERT INTO car_images (car_id, url, is_primary, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [carId, car.images[i], i === 0, i]
        );
      }

      const type = car.listing_type === 'rent'
        ? `$${car.daily_rate}/day`
        : `$${car.price?.toLocaleString()}`;

      console.log(`  ✅ ${car.title}  [${car.listing_type.toUpperCase()}] ${type}  (${car.images.length} images)`);
    }

    await client.query('COMMIT');

    console.log('\n✅  Seed complete!');
    console.log('   Email:    mubaraklouis@gmail.com');
    console.log('   Password: 12345678');
    console.log(`   Cars:     ${CARS.length} (${CARS.filter(c => c.listing_type === 'sale').length} sale, ${CARS.filter(c => c.listing_type === 'rent').length} rental)`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
