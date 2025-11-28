import { AuthResponse, PlaceResult, Reservation, Restaurant, User } from '../types';

// Pointing to the API Gateway port as per Postman collection
const API_BASE_URL = 'http://localhost:8888';

// --- MOCK DATA FOR FALLBACK ---
const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 1, name: "The Gourmet Kitchen", address: "123 Main St, New York, NY", cuisine: "Italian", rating: 4.5, latitude: 40.7128, longitude: -74.0060 },
  { id: 2, name: "Sushi Zen", address: "456 Park Ave, New York, NY", cuisine: "Japanese", rating: 4.8, latitude: 40.7589, longitude: -73.9851 },
  { id: 3, name: "Burger Joint", address: "789 Broadway, New York, NY", cuisine: "American", rating: 4.2, latitude: 40.7484, longitude: -73.9857 },
  { id: 4, name: "Taco Fiesta", address: "101 5th Ave, New York, NY", cuisine: "Mexican", rating: 4.0, latitude: 40.7359, longitude: -73.9911 },
  { id: 5, name: "Curry House", address: "202 6th Ave, New York, NY", cuisine: "Indian", rating: 4.6, latitude: 40.7259, longitude: -74.0011 }
];

const MOCK_RESERVATIONS: Reservation[] = [
  { id: 101, restaurantId: 1, customerName: "Alice Smith", reservationTime: new Date(Date.now() + 86400000).toISOString() }, // Tomorrow
  { id: 102, restaurantId: 2, customerName: "Bob Jones", reservationTime: new Date(Date.now() + 172800000).toISOString() }, // Day after
  { id: 103, restaurantId: 1, customerName: "Charlie Brown", reservationTime: new Date(Date.now() - 3600000).toISOString() }, // 1 hour ago
  { id: 104, restaurantId: 3, customerName: "Diana Prince", reservationTime: new Date(Date.now() + 43200000).toISOString() } // 12 hours from now
];

const MOCK_PLACES: PlaceResult[] = [
  { id: "p1", name: "Central Park Cafe", address: "Central Park, NY", location: { latitude: 40.785091, longitude: -73.968285 }, categories: ["cafe"], distance: 500 },
  { id: "p2", name: "Times Square Diner", address: "Times Square, NY", location: { latitude: 40.7580, longitude: -73.9855 }, categories: ["restaurant"], distance: 1200 },
  { id: "p3", name: "Brooklyn Pizza", address: "Brooklyn Bridge, NY", location: { latitude: 40.7061, longitude: -73.9969 }, categories: ["pizza"], distance: 3000 },
  { id: "p4", name: "Wall St. Coffee", address: "Wall St, NY", location: { latitude: 40.7074, longitude: -74.0113 }, categories: ["coffee"], distance: 4500 }
];

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('jwt_token');
  // Prevent sending the dummy bypass token to the backend, 
  // which would likely cause 401/403 errors on public endpoints.
  if (token && token !== 'BYPASS_TOKEN') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.statusText}`);
  }
  // Some endpoints might return empty body on 200/204
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  auth: {
    login: async (credentials: Pick<User, 'username'> & { password: string }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },
    register: async (userData: Partial<User> & { password: string }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    me: async (): Promise<User> => {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateLocation: async (location: { latitude: number; longitude: number }): Promise<void> => {
      const res = await fetch(`${API_BASE_URL}/users/location`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(location),
      });
      return handleResponse(res);
    },
  },

  restaurants: {
    getAll: async (): Promise<Restaurant[]> => {
      try {
        const res = await fetch(`${API_BASE_URL}/restaurants`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const data = await handleResponse(res);
        // Fallback to mock data if API returns empty array or nothing
        return (data && Array.isArray(data) && data.length > 0) ? data : MOCK_RESTAURANTS;
      } catch (error) {
        console.warn("Fetching restaurants failed or backend unavailable. Using Mock Data.", error);
        return MOCK_RESTAURANTS;
      }
    },
    getById: async (id: number): Promise<Restaurant> => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
      const res = await fetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    update: async (id: number, data: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id: number): Promise<void> => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  reservations: {
    getAll: async (): Promise<Reservation[]> => {
      try {
        const res = await fetch(`${API_BASE_URL}/reservations`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const data = await handleResponse(res);
        return (data && Array.isArray(data) && data.length > 0) ? data : MOCK_RESERVATIONS;
      } catch (error) {
        console.warn("Fetching reservations failed or backend unavailable. Using Mock Data.", error);
        return MOCK_RESERVATIONS;
      }
    },
    create: async (data: Omit<Reservation, 'id'>): Promise<Reservation> => {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    cancel: async (id: number): Promise<void> => {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  places: {
    search: async (query: string, lat: number, lng: number, radius: number = 5000): Promise<PlaceResult[]> => {
      try {
        const params = new URLSearchParams({
          query,
          location: `${lat},${lng}`,
          radius: radius.toString(),
        });
        const res = await fetch(`${API_BASE_URL}/places/search?${params.toString()}`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const data = await handleResponse(res);
        return (data && Array.isArray(data) && data.length > 0) ? data : MOCK_PLACES;
      } catch (error) {
        console.warn("Places search failed or backend unavailable. Using Mock Data.", error);
        return MOCK_PLACES;
      }
    },
  },
};