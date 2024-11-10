export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  price: number;
  availableTickets: number;
  location: string;
  category: string;
  vendorId: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  purchaseDate: string;
  status: 'pending' | 'paid' | 'failed';
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}