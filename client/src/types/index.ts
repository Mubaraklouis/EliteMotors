export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'dealer' | 'renter';
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  subscription_tier: 'free' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface Dealer {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  address?: string;
  city?: string;
  country: string;
  logo_url?: string;
  rating: number;
  is_verified: boolean;
  phone?: string;
  owner_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  dealer_id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price?: number;
  daily_rate?: number;
  mileage?: number;
  color?: string;
  vin?: string;
  description?: string;
  listing_type: 'sale' | 'rent' | 'both';
  status: 'available' | 'rented' | 'sold' | 'maintenance';
  condition: 'new' | 'used' | 'certified_pre_owned';
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'hydrogen';
  transmission: 'automatic' | 'manual' | 'cvt';
  seats: number;
  doors: number;
  features: string[];
  city?: string;
  is_featured: boolean;
  views: number;
  primary_image?: string;
  created_at: string;
  updated_at: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Rental {
  id: string;
  car_id: string;
  renter_id: string;
  dealer_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_rate: number;
  total_amount: number;
  deposit_amount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  car_title?: string;
  make?: string;
  model?: string;
  year?: number;
  car_image?: string;
  renter_name?: string;
  renter_phone?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  page: number;
  pages: number;
}

export interface CarFilters {
  listing_type?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}
