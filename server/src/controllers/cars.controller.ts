import { Request, Response } from 'express';
import {
  createCar,
  findCarById,
  findAllCars,
  findCarsByDealer,
  deleteCar,
  incrementViews,
  updateCarStatus,
  CarFilters,
} from '../models/car.model';
import { addCarImages, getCarImages } from '../models/carImage.model';
import { findDealerByUserId, findDealerById } from '../models/dealer.model';
import { sendSuccess, sendError } from '../utils/response';

export async function getCars(req: Request, res: Response): Promise<void> {
  try {
    const {
      listing_type,
      city,
      minPrice,
      maxPrice,
      search,
      status,
      page,
      limit,
    } = req.query;

    const filters: CarFilters = {
      listing_type: listing_type as string | undefined,
      city: city as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search as string | undefined,
      status: status as string | undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    };

    const { cars, total } = await findAllCars(filters);
    const pageNum = filters.page ?? 1;
    const limitNum = filters.limit ?? 12;

    sendSuccess(res, {
      cars,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    sendError(res, 'Failed to fetch car listings', 500, err);
  }
}

export async function getCarDetail(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const car = await findCarById(id);
    if (!car) {
      sendError(res, 'Car not found', 404);
      return;
    }

    const [images, dealer] = await Promise.all([
      getCarImages(id),
      findDealerById(car.dealer_id),
    ]);

    // Fire-and-forget view increment
    incrementViews(id).catch(() => {});

    sendSuccess(res, { car, images, dealer });
  } catch (err) {
    sendError(res, 'Failed to fetch car details', 500, err);
  }
}

export async function getMyCars(req: Request, res: Response): Promise<void> {
  try {
    const dealer = await findDealerByUserId(req.user!.id);
    if (!dealer) {
      sendError(res, 'Dealer profile not found', 404);
      return;
    }

    const cars = await findCarsByDealer(dealer.id);
    sendSuccess(res, { cars });
  } catch (err) {
    sendError(res, 'Failed to fetch your listings', 500, err);
  }
}

export async function createCarListing(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dealer = await findDealerByUserId(req.user!.id);
    if (!dealer) {
      sendError(res, 'Dealer profile not found', 404);
      return;
    }

    const {
      title,
      make,
      model,
      year,
      price,
      dailyRate,
      mileage,
      color,
      description,
      listingType,
      condition,
      fuelType,
      transmission,
      seats,
      doors,
      city,
      features,
    } = req.body as Record<string, string>;

    if (!title || !make || !model || !year || !listingType) {
      sendError(res, 'Title, make, model, year and listing type are required', 400);
      return;
    }

    const car = await createCar({
      dealerId: dealer.id,
      title,
      make,
      model,
      year: Number(year),
      price: price ? Number(price) : undefined,
      dailyRate: dailyRate ? Number(dailyRate) : undefined,
      mileage: mileage ? Number(mileage) : undefined,
      color,
      description,
      listingType: listingType || 'rent',
      condition: condition || 'used',
      fuelType: fuelType || 'petrol',
      transmission: transmission || 'automatic',
      seats: seats ? Number(seats) : 5,
      doors: doors ? Number(doors) : 4,
      city,
      features: features ? JSON.parse(features) : [],
    });

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      await addCarImages(
        car.id,
        files.map((f, i) => ({
          url: `/uploads/${f.filename}`,
          isPrimary: i === 0,
          sortOrder: i,
        }))
      );
    }

    const images = await getCarImages(car.id);
    sendSuccess(res, { car, images }, 201, 'Car listing created successfully');
  } catch (err) {
    sendError(res, 'Failed to create car listing', 500, err);
  }
}

export async function deleteCarListing(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const car = await findCarById(id);
    if (!car) {
      sendError(res, 'Car not found', 404);
      return;
    }

    const dealer = await findDealerByUserId(req.user!.id);
    if (!dealer || car.dealer_id !== dealer.id) {
      sendError(res, 'You do not have permission to delete this listing', 403);
      return;
    }

    await deleteCar(id);
    sendSuccess(res, null, 200, 'Car listing deleted successfully');
  } catch (err) {
    sendError(res, 'Failed to delete car listing', 500, err);
  }
}

export async function updateCarListingStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: string };

    const car = await findCarById(id);
    if (!car) { sendError(res, 'Car not found', 404); return; }

    const dealer = await findDealerByUserId(req.user!.id);
    if (!dealer || car.dealer_id !== dealer.id) {
      sendError(res, 'Not authorized', 403); return;
    }

    await updateCarStatus(id, status);
    sendSuccess(res, null, 200, 'Status updated');
  } catch (err) {
    sendError(res, 'Failed to update status', 500, err);
  }
}
