# Vento - Real-Time Event Ticketing System

A modern event ticketing platform built with React, Node.js, and SQLite, featuring real-time updates and thread-safe ticket management.

## Features

- Real-time ticket availability updates
- Vendor dashboard for event management
- Secure ticket purchases
- Email-based ticket retrieval
- Thread-safe concurrent ticket processing

## Tech Stack

### Frontend

- React 18
- TypeScript
- TanStack Query
- Shadcn/ui
- Axios
- JWT Authentication

### Backend

- Node.js
- Express
- SQLite3
- JSON Web Tokens

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- SQLite3

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/supunsathsara/Vento.git
   cd vento
   ```

2. **Install dependencies:**

   - **Frontend:**

     ```bash
     cd client
     pnpm install
     ```

   - **Backend:**
     ```bash
     cd server
     pnpm install
     ```

3. **Configure environment variables:**

   - **Frontend (.env):**

     ```env
     VITE_API_URL=http://localhost:3001
     ```

   - **Backend (.env):**
     ```env
     PORT=3001
     FRONTEND_URL=http://localhost:5173
     JWT_SECRET=your-secret-key
     NODE_ENV=development
     ```

4. **Start the development servers:**

   - **Backend:**

     ```bash
     cd server
     pnpm dev
     ```

   - **Frontend:**
     ```bash
     cd client
     pnpm dev
     ```

## Usage

### Vendor Dashboard

- Register/Login as a vendor
- Create and manage events
- View ticket sales and revenue
- Manage ticket statuses

### Customer Features

- Browse available events
- Purchase tickets without registration
- View ticket details using email/ticket ID
- Share ticket links

## API Endpoints

### Authentication

- `POST /auth/register` - Register new vendor
- `POST /auth/login` - Vendor login

### Events

- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create new event (vendor only)
- `PUT /events/:id` - Update event (vendor only)
- `DELETE /events/:id` - Delete event (vendor only)

### Tickets

- `POST /tickets/purchase` - Purchase tickets
- `GET /tickets/:id` - Get ticket details
- `GET /tickets/email/:email` - Get tickets by email
- `PATCH /tickets/:id/status` - Update ticket status (vendor only)

## Development

### Database Schema

```sql
-- Users (Vendors)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'vendor'
);

-- Events
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    name TEXT,
    date TEXT,
    time TEXT,
    price REAL,
    availableTickets INTEGER,
    location TEXT,
    category TEXT,
    vendorId TEXT,
    FOREIGN KEY(vendorId) REFERENCES users(id)
);

-- Tickets
CREATE TABLE tickets (
    id TEXT PRIMARY KEY,
    eventId TEXT,
    customerEmail TEXT,
    customerName TEXT,
    purchaseDate TEXT,
    status TEXT,
    quantity INTEGER,
    FOREIGN KEY(eventId) REFERENCES events(id)
);
```

## Thread Safety

The system implements thread-safe ticket purchasing using async locks to prevent overselling and maintain data consistency during concurrent transactions.

## Testing

Run tests:

```bash
pnpm test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
