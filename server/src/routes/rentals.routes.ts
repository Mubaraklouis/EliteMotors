import { Router } from 'express';
import { createRentalRequest, getMyRentals } from '../controllers/rentals.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createRentalRequest);
router.get('/my', requireAuth, getMyRentals);

export default router;
