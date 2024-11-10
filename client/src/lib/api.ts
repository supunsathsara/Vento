import axios from 'axios';
import { Event, Ticket, AuthResponse } from '@/types';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', data.token);
    
    // Decode and store user info
    const decoded = jwtDecode<{ id: string }>(data.token);
    localStorage.setItem('userId', decoded.id);
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },
};

export const events = {
  getAll: async (filters?: { category?: string; vendorId?: string }) => {
    const { data } = await api.get<Event[]>('/events', { params: filters });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  create: async (event: Omit<Event, 'id' | 'vendorId'>) => {
    const { data } = await api.post<{ message: string; event: Event }>('/events', event);
    return data;
  },

  update: async (id: string, event: Partial<Event>) => {
    const { data } = await api.put<Event>(`/events/${id}`, event);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/events/${id}`);
    return data;
  },

  getStats: async (id: string) => {
    const { data } = await api.get(`/events/${id}/stats`);
    return data;
  },
};

export const tickets = {
  purchase: async (ticketData: Omit<Ticket, 'id' | 'purchaseDate' | 'status'>) => {
    const { data } = await api.post<{ message: string; ticket: Ticket }>(
      '/tickets/purchase',
      ticketData
    );
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get<Ticket>(`/tickets/${id}`);
    return data;
  },

  validate: async (id: string) => {
    const { data } = await api.get(`/tickets/validate/${id}`);
    return data;
  },

  getByEmail: async (email: string) => {
    const { data } = await api.get<Ticket[]>(`/tickets/email/${email}`);
    return data;
  },

  getByEventId: async (eventId: string) => {
    const { data } = await api.get<Ticket[]>(`/events/${eventId}/tickets`);
    return data;
  },

  updateStatus: async (id: string, status: Ticket['status']) => {
    const { data } = await api.patch<{ message: string; ticket: Ticket }>(
      `/tickets/${id}/status`,
      { status }
    );
    return data;
  },
};

export default {
  auth,
  events,
  tickets,
};