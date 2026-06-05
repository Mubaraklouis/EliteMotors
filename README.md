# EliteMotors 🚗

> A premium platform where car dealers can **list vehicles for sale** and **rent them out** to users.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19 · TypeScript · Vite · Tailwind CSS v4 |
| Backend    | Express 4 · TypeScript · Node.js       |
| Database   | PostgreSQL 16                          |
| Auth       | JWT (access + refresh token rotation)  |

---

## Project Structure

```
EliteMotors/
├── client/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── assets/          # Static assets (images, fonts)
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route-level page components
│   │   ├── services/        # API call functions
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── utils/           # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
└── server/                  # Express + TypeScript backend
    ├── src/
    │   ├── config/          # Environment & app config
    │   ├── controllers/     # Route handler functions
    │   ├── db/
    │   │   ├── index.ts     # PostgreSQL pool connection
    │   │   └── migrate.ts   # Sequential migration runner
    │   ├── middleware/      # Auth, error, validation middleware
    │   ├── models/          # DB query abstractions
    │   ├── routes/          # Express router definitions
    │   ├── types/           # TypeScript type declarations
    │   ├── utils/           # Shared utilities
    │   └── index.ts         # App entry point
    ├── .env.example
    ├── tsconfig.json
    └── package.json
```

---

## Database Schema

The PostgreSQL schema includes the following tables:

| Table         | Description                                  |
|---------------|----------------------------------------------|
| `users`       | All platform users (admins, dealers, renters)|
| `dealers`     | Dealer business profiles linked to users     |
| `cars`        | Vehicle listings (sale and/or rent)          |
| `car_images`  | Multiple images per car listing              |
| `rentals`     | Booking records with date ranges & pricing   |
| `reviews`     | Post-rental reviews (1–5 stars)              |
| `_migrations` | Tracks which migrations have been applied    |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL 16 running locally
- `npm` or `pnpm`

---

### 1. Clone the repository

```bash
git clone https://github.com/Mubaraklouis/EliteMotors.git
cd EliteMotors
```

### 2. Set up the Server

```bash
cd server
cp .env.example .env       # Fill in your DB credentials and JWT secrets
npm install
npm run migrate            # Creates all DB tables
npm run dev                # Starts on http://localhost:5000
```

### 3. Set up the Client

```bash
cd client
cp .env.example .env       # Set VITE_API_URL if needed
npm install
npm run dev                # Starts on http://localhost:5173
```

---

## Available Scripts

### Server (`/server`)

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start server with hot reload         |
| `npm run build`   | Compile TypeScript to `dist/`        |
| `npm start`       | Run compiled production server       |
| `npm run migrate` | Apply pending database migrations    |

### Client (`/client`)

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start Vite dev server                |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build             |

---

## Environment Variables

### Server — `server/.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elitemotors
DB_USER=postgres
DB_PASSWORD=your_password

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
```

### Client — `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## User Roles

| Role     | Capabilities                                             |
|----------|----------------------------------------------------------|
| `admin`  | Full access — manage users, dealers, listings           |
| `dealer` | Create dealer profile, list cars for sale/rent          |
| `renter` | Browse cars, create rental bookings, leave reviews      |

---

## License

MIT © 2026 EliteMotors
