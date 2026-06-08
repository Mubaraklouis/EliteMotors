import { Router } from 'express';
import {
  getCars,
  getCarDetail,
  getMyCars,
  createCarListing,
  deleteCarListing,
  updateCarListingStatus,
} from '../controllers/cars.controller';
import { requireAuth, requireDealer } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public
router.get('/', getCars);

// Dealer protected — MUST be before /:id to avoid route conflict
router.get('/my', requireAuth, requireDealer, getMyCars);

// Public
router.get('/:id', getCarDetail);

// Dealer protected
router.post(
  '/',
  requireAuth,
  requireDealer,
  upload.array('images', 6),
  createCarListing
);
router.patch('/:id/status', requireAuth, requireDealer, updateCarListingStatus);
router.delete('/:id', requireAuth, requireDealer, deleteCarListing);

export default router;
