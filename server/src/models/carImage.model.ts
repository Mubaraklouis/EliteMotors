import { pool } from '../db';
import { CarImage } from '../types';

export async function addCarImages(
  carId: string,
  images: Array<{ url: string; isPrimary: boolean; sortOrder: number }>
): Promise<CarImage[]> {
  if (images.length === 0) return [];

  const results = await Promise.all(
    images.map((img) =>
      pool.query(
        `INSERT INTO car_images (car_id, url, is_primary, sort_order)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [carId, img.url, img.isPrimary, img.sortOrder]
      )
    )
  );

  return results.map((r) => r.rows[0] as CarImage);
}

export async function getCarImages(carId: string): Promise<CarImage[]> {
  const result = await pool.query(
    `SELECT * FROM car_images WHERE car_id = $1 ORDER BY sort_order ASC`,
    [carId]
  );
  return result.rows as CarImage[];
}

export async function deleteCarImage(id: string): Promise<void> {
  await pool.query('DELETE FROM car_images WHERE id = $1', [id]);
}
