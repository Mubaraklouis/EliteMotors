import { pool } from '../db';
import { Car } from '../types';

export interface CarFilters {
  listing_type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const PRIMARY_IMAGE_SQL = `(
  SELECT url FROM car_images ci
  WHERE ci.car_id = c.id AND ci.is_primary = true
  LIMIT 1
) AS primary_image`;

export async function createCar(data: {
  dealerId: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price?: number;
  dailyRate?: number;
  mileage?: number;
  color?: string;
  description?: string;
  listingType: string;
  condition: string;
  fuelType: string;
  transmission: string;
  seats?: number;
  doors?: number;
  city?: string;
  features?: string[];
}): Promise<Car> {
  const result = await pool.query(
    `INSERT INTO cars
       (dealer_id, title, make, model, year, price, daily_rate, mileage, color,
        description, listing_type, condition, fuel_type, transmission,
        seats, doors, city, features)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     RETURNING *`,
    [
      data.dealerId,
      data.title,
      data.make,
      data.model,
      data.year,
      data.price ?? null,
      data.dailyRate ?? null,
      data.mileage ?? null,
      data.color ?? null,
      data.description ?? null,
      data.listingType,
      data.condition,
      data.fuelType,
      data.transmission,
      data.seats ?? 5,
      data.doors ?? 4,
      data.city ?? null,
      JSON.stringify(data.features ?? []),
    ]
  );
  return result.rows[0] as Car;
}

export async function findCarById(id: string): Promise<Car | null> {
  const result = await pool.query(
    `SELECT c.*, ${PRIMARY_IMAGE_SQL} FROM cars c WHERE c.id = $1`,
    [id]
  );
  return (result.rows[0] as Car) ?? null;
}

export async function findAllCars(
  filters: CarFilters
): Promise<{ cars: Car[]; total: number }> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  // Exclude sold unless explicitly requested
  if (!filters.status) {
    conditions.push(`c.status != 'sold'`);
  } else {
    conditions.push(`c.status = $${idx++}`);
    params.push(filters.status);
  }

  if (filters.listing_type && filters.listing_type !== 'all') {
    conditions.push(`(c.listing_type = $${idx} OR c.listing_type = 'both')`);
    params.push(filters.listing_type);
    idx++;
  }

  if (filters.city) {
    conditions.push(`c.city ILIKE $${idx++}`);
    params.push(`%${filters.city}%`);
  }

  if (filters.search) {
    conditions.push(
      `(c.title ILIKE $${idx} OR c.make ILIKE $${idx} OR c.model ILIKE $${idx})`
    );
    params.push(`%${filters.search}%`);
    idx++;
  }

  if (filters.minPrice !== undefined) {
    conditions.push(`c.price >= $${idx++}`);
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(`c.price <= $${idx++}`);
    params.push(filters.maxPrice);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM cars c ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count as string, 10);

  const result = await pool.query(
    `SELECT c.*, ${PRIMARY_IMAGE_SQL}
     FROM cars c
     ${where}
     ORDER BY c.is_featured DESC, c.created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...params, limit, offset]
  );

  return { cars: result.rows as Car[], total };
}

export async function findCarsByDealer(dealerId: string): Promise<Car[]> {
  const result = await pool.query(
    `SELECT c.*, ${PRIMARY_IMAGE_SQL}
     FROM cars c
     WHERE c.dealer_id = $1
     ORDER BY c.created_at DESC`,
    [dealerId]
  );
  return result.rows as Car[];
}

export async function updateCar(
  id: string,
  data: Partial<Car>
): Promise<Car> {
  const result = await pool.query(
    `UPDATE cars
     SET title       = COALESCE($1, title),
         price       = COALESCE($2, price),
         daily_rate  = COALESCE($3, daily_rate),
         description = COALESCE($4, description),
         status      = COALESCE($5, status),
         city        = COALESCE($6, city),
         updated_at  = NOW()
     WHERE id = $7
     RETURNING *`,
    [
      data.title ?? null,
      data.price ?? null,
      data.daily_rate ?? null,
      data.description ?? null,
      data.status ?? null,
      data.city ?? null,
      id,
    ]
  );
  return result.rows[0] as Car;
}

export async function deleteCar(id: string): Promise<void> {
  await pool.query('DELETE FROM cars WHERE id = $1', [id]);
}

export async function incrementViews(id: string): Promise<void> {
  await pool.query('UPDATE cars SET views = views + 1 WHERE id = $1', [id]);
}

export async function updateCarStatus(
  id: string,
  status: string
): Promise<void> {
  await pool.query(
    'UPDATE cars SET status = $1, updated_at = NOW() WHERE id = $2',
    [status, id]
  );
}
