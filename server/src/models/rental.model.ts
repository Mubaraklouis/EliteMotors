import { pool } from '../db';
import { Rental } from '../types';

export async function createRental(data: {
  carId: string;
  renterId: string;
  dealerId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  notes?: string;
}): Promise<Rental> {
  const result = await pool.query(
    `INSERT INTO rentals
       (car_id, renter_id, dealer_id, start_date, end_date,
        total_days, daily_rate, total_amount, status, payment_status, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'confirmed','pending',$9)
     RETURNING *`,
    [
      data.carId,
      data.renterId,
      data.dealerId,
      data.startDate,
      data.endDate,
      data.totalDays,
      data.dailyRate,
      data.totalAmount,
      data.notes ?? null,
    ]
  );
  return result.rows[0] as Rental;
}

export async function findRentalsByRenter(renterId: string): Promise<Rental[]> {
  const result = await pool.query(
    `SELECT r.*,
            c.title  AS car_title,
            c.make,
            c.model,
            c.year,
            (SELECT url FROM car_images ci
             WHERE ci.car_id = r.car_id AND ci.is_primary = true LIMIT 1) AS car_image
     FROM rentals r
     JOIN cars  c ON c.id = r.car_id
     WHERE r.renter_id = $1
     ORDER BY r.created_at DESC`,
    [renterId]
  );
  return result.rows as Rental[];
}

export async function findRentalsByDealer(dealerId: string): Promise<Rental[]> {
  const result = await pool.query(
    `SELECT r.*,
            c.title         AS car_title,
            u.full_name     AS renter_name,
            u.phone         AS renter_phone
     FROM rentals r
     JOIN cars  c ON c.id  = r.car_id
     JOIN users u ON u.id  = r.renter_id
     WHERE r.dealer_id = $1
     ORDER BY r.created_at DESC`,
    [dealerId]
  );
  return result.rows as Rental[];
}

export async function checkCarAvailability(
  carId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const result = await pool.query(
    `SELECT id FROM rentals
     WHERE car_id = $1
       AND status NOT IN ('cancelled','completed')
       AND (start_date, end_date) OVERLAPS ($2::date, $3::date)`,
    [carId, startDate, endDate]
  );
  return result.rows.length === 0;
}
