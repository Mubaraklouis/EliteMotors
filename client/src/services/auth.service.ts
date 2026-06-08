import api from './api';
import { User, Dealer } from '../types';

export const authService = {
  async register(data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    businessName?: string;
    city?: string;
  }): Promise<{ user: User; dealer?: Dealer; token: string }> {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; dealer?: Dealer; token: string }> {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  async getMe(): Promise<{ user: User; dealer?: Dealer }> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
