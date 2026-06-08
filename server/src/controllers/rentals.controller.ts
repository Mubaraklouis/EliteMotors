import { Request, Response } from 'express';
import {
  createRental,
  findRentalsByRenter,
  checkCarAvailability,
} from '../models/rental.model';
import { findCarById, updateCarStatus } from '../models/car.model';
import { sendSuccess, sendError } from '../utils/response';

export async function createRentalRequest(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { carId, startDate, endDate, notes } = req.body as {
      carId: string;
      startDate: string;
      endDate: string;
      notes?: string;
    };

    if (!carId || !startDate || !endDate) {
      sendError(res, 'Car ID, start date and end date are required', 400);
      return;
    }

    const car = await findCarById(carId);
    if (!car) { sendError(res, 'Car not found', 404); return; }
    if (car.status !== 'available') {
      sendError(res, 'This car is not currently available for rental', 400);
      return;
    }
    if (!car.daily_rate) {
      sendError(res, 'This car does not have a rental rate configured', 400);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      sendError(res, 'Start date cannot be in the past', 400);
      return;
    }
    if (end <= start) {
      sendError(res, 'End date must be after start date', 400);
      return;
    }

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const available = await checkCarAvailability(carId, startDate, endDate);
    if (!available) {
      sendError(res, 'Car is not available for the selected dates', 400);
      return;
    }

    const totalAmount = totalDays * car.daily_rate;

    const rental = await createRental({
      carId,
      renterId: req.user!.id,
      dealerId: car.dealer_id,
      startDate,
      endDate,
      totalDays,
      dailyRate: car.daily_rate,
      totalAmount,
      notes,
    });

    await updateCarStatus(carId, 'rented');

    sendSuccess(res, { rental }, 201, 'Rental confirmed successfully!');
  } catch (err) {
    sendError(res, 'Failed to create rental', 500, err);
  }
}

export async function getMyRentals(req: Request, res: Response): Promise<void> {
  try {
    const rentals = await findRentalsByRenter(req.user!.id);
    sendSuccess(res, { rentals });
  } catch (err) {
    sendError(res, 'Failed to fetch rental history', 500, err);
  }
}
