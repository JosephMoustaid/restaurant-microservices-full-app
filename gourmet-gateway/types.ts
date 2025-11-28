export interface User {
  id?: number;
  username: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  token?: string; // For client-side storage
}

export interface Restaurant {
  id?: number;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
  latitude: number;
  longitude: number;
}

export interface Reservation {
  id?: number;
  restaurantId: number;
  customerName: string;
  reservationTime: string; // ISO String
}

export interface PlaceResult {
  id?: string;
  name: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  categories?: string[];
  distance?: number;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface ApiError {
  message: string;
  status?: number;
}