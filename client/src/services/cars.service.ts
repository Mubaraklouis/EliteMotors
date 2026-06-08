import api, { API_URL } from './api';
import type { Car, CarImage, Dealer, CarFilters, CarsResponse } from '../types';

export const carsService = {
  async getCars(filters: CarFilters = {}): Promise<CarsResponse> {
    const res = await api.get('/cars', { params: filters });
    return res.data.data;
  },

  async getCar(
    id: string
  ): Promise<{ car: Car; images: CarImage[]; dealer: Dealer | null }> {
    const res = await api.get(`/cars/${id}`);
    return res.data.data;
  },

  async getMyCars(): Promise<Car[]> {
    const res = await api.get('/cars/my');
    return res.data.data.cars;
  },

  async createCar(formData: FormData): Promise<{ car: Car; images: CarImage[] }> {
    const res = await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async deleteCar(id: string): Promise<void> {
    await api.delete(`/cars/${id}`);
  },

  async updateCarStatus(id: string, status: string): Promise<void> {
    await api.patch(`/cars/${id}/status`, { status });
  },

  /** Returns full absolute URL for a car image path */
  imgUrl(path?: string | null): string {
    if (!path) {
      return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
    }
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  },
};
