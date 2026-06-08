import api from './api';
import type { Rental } from '../types';

export const rentalsService = {
  async createRental(data: {
    carId: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }): Promise<Rental> {
    const res = await api.post('/rentals', data);
    return res.data.data.rental;
  },

  async getMyRentals(): Promise<Rental[]> {
    const res = await api.get('/rentals/my');
    return res.data.data.rentals;
  },
};
