import { Request, Response } from 'express';
import { updateUser } from '../models/user.model';
import { findDealerByUserId } from '../models/dealer.model';
import { sendSuccess, sendError } from '../utils/response';

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user!;
    let dealer = null;
    if (user.role === 'dealer') {
      dealer = await findDealerByUserId(user.id);
    }
    sendSuccess(res, { user, dealer });
  } catch (err) {
    sendError(res, 'Failed to get profile', 500, err);
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, phone } = req.body as {
      fullName?: string;
      phone?: string;
    };
    const user = await updateUser(req.user!.id, { fullName, phone });
    sendSuccess(res, { user }, 200, 'Profile updated successfully');
  } catch (err) {
    sendError(res, 'Failed to update profile', 500, err);
  }
}
