/**
 * EliteMotors — Database Migration Runner
 *
 * Run with:  npm run migrate
 *
 * Migrations are applied in order. Each is tracked in the `_migrations`
 * table so it only ever runs once.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const migrations = [
  {
    name: '001_create_migrations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS _migrations (
        id     SERIAL PRIMARY KEY,
        name   TEXT UNIQUE NOT NULL,
        run_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: '002_create_users',
    sql: `
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'dealer', 'renter');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name     VARCHAR(100) NOT NULL,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role          user_role NOT NULL DEFAULT 'renter',
        phone         VARCHAR(20),
        avatar_url    TEXT,
        is_verified   BOOLEAN DEFAULT FALSE,
        is_active     BOOLEAN DEFAULT TRUE,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: '003_create_dealers',
    sql: `
      CREATE TABLE IF NOT EXISTS dealers (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_name VARCHAR(150) NOT NULL,
        description   TEXT,
        address       TEXT NOT NULL DEFAULT '',
        city          VARCHAR(100) NOT NULL DEFAULT '',
        country       VARCHAR(100) NOT NULL DEFAULT 'NG',
        logo_url      TEXT,
        rating        NUMERIC(2,1) DEFAULT 0.0,
        is_verified   BOOLEAN DEFAULT FALSE,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: '004_create_cars',
    sql: `
      DO $$ BEGIN
        CREATE TYPE car_status AS ENUM ('available','rented','sold','maintenance');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE TYPE car_condition AS ENUM ('new','used','certified_pre_owned');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE TYPE fuel_type AS ENUM ('petrol','diesel','electric','hybrid','hydrogen');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE TYPE transmission AS ENUM ('automatic','manual','cvt');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE TYPE listing_type AS ENUM ('sale','rent','both');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      CREATE TABLE IF NOT EXISTS cars (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id    UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
        title        VARCHAR(200) NOT NULL,
        make         VARCHAR(100) NOT NULL,
        model        VARCHAR(100) NOT NULL,
        year         INTEGER NOT NULL,
        price        NUMERIC(12,2),
        daily_rate   NUMERIC(8,2),
        mileage      INTEGER,
        color        VARCHAR(50),
        vin          VARCHAR(17) UNIQUE,
        description  TEXT,
        listing_type listing_type  NOT NULL DEFAULT 'rent',
        status       car_status    NOT NULL DEFAULT 'available',
        condition    car_condition NOT NULL DEFAULT 'used',
        fuel_type    fuel_type     NOT NULL DEFAULT 'petrol',
        transmission transmission  NOT NULL DEFAULT 'automatic',
        seats        INTEGER DEFAULT 5,
        doors        INTEGER DEFAULT 4,
        features     JSONB   DEFAULT '[]',
        city         VARCHAR(100),
        is_featured  BOOLEAN DEFAULT FALSE,
        views        INTEGER DEFAULT 0,
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        updated_at   TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_cars_dealer ON cars(dealer_id);
      CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
      CREATE INDEX IF NOT EXISTS idx_cars_city   ON cars(city);
    `,
  },
  {
    name: '005_create_car_images',
    sql: `
      CREATE TABLE IF NOT EXISTS car_images (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        car_id     UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        url        TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
  {
    name: '006_create_rentals',
    sql: `
      DO $$ BEGIN
        CREATE TYPE rental_status AS ENUM ('pending','confirmed','active','completed','cancelled');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending','paid','refunded','failed');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      CREATE TABLE IF NOT EXISTS rentals (
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        car_id              UUID NOT NULL REFERENCES cars(id),
        renter_id           UUID NOT NULL REFERENCES users(id),
        dealer_id           UUID NOT NULL REFERENCES dealers(id),
        start_date          DATE NOT NULL,
        end_date            DATE NOT NULL,
        total_days          INTEGER NOT NULL,
        daily_rate          NUMERIC(8,2)  NOT NULL,
        total_amount        NUMERIC(12,2) NOT NULL,
        deposit_amount      NUMERIC(10,2) DEFAULT 0,
        status              rental_status  NOT NULL DEFAULT 'pending',
        payment_status      payment_status NOT NULL DEFAULT 'pending',
        notes               TEXT,
        cancellation_reason TEXT,
        cancelled_at        TIMESTAMPTZ,
        created_at          TIMESTAMPTZ DEFAULT NOW(),
        updated_at          TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT valid_dates CHECK (end_date > start_date)
      );
    `,
  },
  {
    name: '007_create_reviews',
    sql: `
      CREATE TABLE IF NOT EXISTS reviews (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rental_id   UUID UNIQUE NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
        reviewer_id UUID NOT NULL REFERENCES users(id),
        car_id      UUID NOT NULL REFERENCES cars(id),
        dealer_id   UUID NOT NULL REFERENCES dealers(id),
        rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment     TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  },
];

async function run() {
  const client = await pool.connect();
  console.log('🔄  Running migrations…');
  try {
    // Ensure tracking table exists first
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id     SERIAL PRIMARY KEY,
        name   TEXT UNIQUE NOT NULL,
        run_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    for (const m of migrations) {
      const { rows } = await client.query(
        'SELECT id FROM _migrations WHERE name = $1',
        [m.name]
      );
      if (rows.length) {
        console.log(`  ⏭  skip  ${m.name}`);
        continue;
      }
      await client.query('BEGIN');
      await client.query(m.sql);
      await client.query('INSERT INTO _migrations (name) VALUES ($1)', [m.name]);
      await client.query('COMMIT');
      console.log(`  ✅  done  ${m.name}`);
    }
    console.log('✅  All migrations complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
