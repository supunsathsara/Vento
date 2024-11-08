export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  price: number;
  availableTickets: number;
  location: string;
  category: string;
}

export interface TicketDetails {
  id: string;
  customerName: string;
  email: string;
  paymentStatus: "paid" | "pending" | "failed";
  purchaseDate: string;
  eventName: string;
}