# EliteMotors 🚗

> A premium platform where car dealers can **list vehicles for sale** and **rent them out** to users.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19 · TypeScript · Vite · Tailwind CSS v4  |
| Backend    | Express 4 · TypeScript · Node.js                |
| Database   | PostgreSQL 16                                   |
| Auth       | JWT (access + refresh token rotation)           |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **PostgreSQL** 16 running locally — [postgresql.org](https://www.postgresql.org)
- **npm** (comes with Node.js)

### 1. Clone

```bash
git clone https://github.com/Mubaraklouis/EliteMotors.git
cd EliteMotors
```

### 2. Install all dependencies

```bash
bash scripts/setup.sh
```

This single command will:
- Check Node.js version (≥ 18 required)
- Install root, server, and client dependencies
- Copy `.env.example` → `.env` for both server and client
- Create the `elitemotors` PostgreSQL database if it doesn't exist

### 3. Configure environment

Open `server/.env` and fill in your credentials:

```env
DB_USER=your_postgres_user
DB_PASSWORD=your_password
JWT_SECRET=a_long_random_string
REFRESH_TOKEN_SECRET=another_long_random_string
```

### 4. Run database migrations

```bash
npm run migrate
```

### 5. Start the project

```bash
bash scripts/dev.sh
# or
npm run dev
```

| Service    | URL                               |
|------------|-----------------------------------|
| Frontend   | http://localhost:5173             |
| Backend    | http://localhost:5001             |
| Health     | http://localhost:5001/api/health  |

---

## Project Structure

```
EliteMotors/
├── scripts/
│   ├── setup.sh          # Install all dependencies + create DB
│   └── dev.sh            # Start both servers
│
├── client/               # React + TypeScript frontend
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Route-level page components
│   │   ├── services/     # API call functions
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Helper functions
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
└── server/               # Express + TypeScript backend
    ├── src/
    │   ├── config/       # Environment & app config
    │   ├── controllers/  # Route handler functions
    │   ├── db/
    │   │   ├── index.ts  # PostgreSQL pool connection
    │   │   └── migrate.ts# Sequential migration runner
    │   ├── middleware/   # Auth, error, validation middleware
    │   ├── models/       # DB query abstractions
    │   ├── routes/       # Express router definitions
    │   ├── types/        # TypeScript type declarations
    │   └── utils/        # Shared utilities
    ├── .env.example
    ├── tsconfig.json
    └── package.json
```

---

## Database Schema

| Table         | Description                                   |
|---------------|-----------------------------------------------|
| `users`       | All users (admins, dealers, renters)          |
| `dealers`     | Dealer business profiles linked to users      |
| `cars`        | Vehicle listings (sale and/or rent)           |
| `car_images`  | Multiple images per car listing               |
| `rentals`     | Booking records with date ranges & pricing    |
| `reviews`     | Post-rental reviews (1–5 stars)               |
| `_migrations` | Tracks applied migrations                     |

---

## Available Scripts (from root)

| Command               | Description                                   |
|-----------------------|-----------------------------------------------|
| `bash scripts/setup.sh` | Install all dependencies + setup DB        |
| `bash scripts/dev.sh`   | Start both servers                          |
| `npm run dev`           | Start both servers with concurrently        |
| `npm run dev:server`    | Start Express server only                  |
| `npm run dev:client`    | Start React client only                    |
| `npm run migrate`       | Apply database migrations                  |
| `npm run build`         | Build both server and client               |

---

## User Roles

| Role     | Capabilities                                              |
|----------|-----------------------------------------------------------|
| `admin`  | Full access — manage users, dealers, listings            |
| `dealer` | Create dealer profile, list cars for sale/rent           |
| `renter` | Browse cars, create rental bookings, leave reviews       |

---

## Environment Variables

### `server/.env`

```env
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=elitemotors
DB_USER=your_postgres_user
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5001/api
```

---

## License

MIT © 2026 EliteMotors
