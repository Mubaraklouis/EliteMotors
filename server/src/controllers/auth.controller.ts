import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../models/user.model';
import { createDealer, findDealerByUserId } from '../models/dealer.model';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const {
      fullName,
      email,
      password,
      role = 'renter',
      phone,
      businessName,
      city,
    } = req.body as {
      fullName: string;
      email: string;
      password: string;
      role?: 'renter' | 'dealer';
      phone?: string;
      businessName?: string;
      city?: string;
    };

    if (!fullName || !email || !password) {
      sendError(res, 'Full name, email and password are required', 400);
      return;
    }

    if (password.length < 6) {
      sendError(res, 'Password must be at least 6 characters', 400);
      return;
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      sendError(res, 'An account with this email already exists', 400);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({
      fullName,
      email,
      passwordHash,
      role: role === 'dealer' ? 'dealer' : 'renter',
      phone,
    });

    let dealer = null;
    if (user.role === 'dealer') {
      dealer = await createDealer({
        userId: user.id,
        businessName: businessName || fullName,
        city,
      });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    sendSuccess(res, { user, dealer, token }, 201, 'Account created successfully');
  } catch (err) {
    sendError(res, 'Registration failed. Please try again.', 500, err);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    const userWithHash = await findUserByEmail(email);
    if (!userWithHash) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const valid = await bcrypt.compare(password, userWithHash.password_hash);
    if (!valid) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Strip password_hash
    const { password_hash: _ph, ...user } = userWithHash;

    let dealer = null;
    if (user.role === 'dealer') {
      dealer = await findDealerByUserId(user.id);
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    sendSuccess(res, { user, dealer, token }, 200, 'Login successful');
  } catch (err) {
    sendError(res, 'Login failed. Please try again.', 500, err);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
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
