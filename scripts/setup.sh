#!/usr/bin/env bash
# ============================================================
# EliteMotors — Setup Script
# Installs all dependencies and prepares the environment.
# Usage: bash scripts/setup.sh
# ============================================================

set -e  # Exit immediately on error

# ─── Colours ────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
RESET='\033[0m'

log()    { echo -e "${CYAN}[setup]${RESET} $1"; }
success(){ echo -e "${GREEN}[✔]${RESET} $1"; }
warn()   { echo -e "${YELLOW}[!]${RESET} $1"; }
error()  { echo -e "${RED}[✘]${RESET} $1"; exit 1; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║      EliteMotors — Project Setup     ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════╝${RESET}"
echo ""

# ─── 1. Prerequisites ────────────────────────────────────────
log "Checking prerequisites..."

command -v node >/dev/null 2>&1 || error "Node.js is not installed. Install it from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || error "npm is not installed."
command -v psql >/dev/null 2>&1 || warn  "psql not found — make sure PostgreSQL is installed and running."

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  error "Node.js v18+ required (found v$NODE_VERSION)"
fi

success "Node $(node -v) · npm $(npm -v)"

# ─── 2. Root dependencies (concurrently) ─────────────────────
log "Installing root dependencies..."
npm install --silent
success "Root dependencies installed"

# ─── 3. Server dependencies ──────────────────────────────────
log "Installing server dependencies..."
npm install --prefix server --silent
success "Server dependencies installed"

# ─── 4. Client dependencies ──────────────────────────────────
log "Installing client dependencies..."
npm install --prefix client --silent
success "Client dependencies installed"

# ─── 5. Server .env setup ────────────────────────────────────
if [ ! -f "server/.env" ]; then
  log "Creating server/.env from .env.example..."
  cp server/.env.example server/.env
  success "server/.env created — please fill in your credentials before running the project"
else
  success "server/.env already exists — skipping"
fi

# ─── 6. Client .env setup ────────────────────────────────────
if [ ! -f "client/.env" ]; then
  log "Creating client/.env from .env.example..."
  cp client/.env.example client/.env
  success "client/.env created"
else
  success "client/.env already exists — skipping"
fi

# ─── 7. PostgreSQL — create database ─────────────────────────
if command -v psql >/dev/null 2>&1; then
  # Read DB config from server/.env
  DB_NAME=$(grep '^DB_NAME=' server/.env | cut -d'=' -f2)
  DB_USER=$(grep '^DB_USER=' server/.env | cut -d'=' -f2)
  DB_HOST=$(grep '^DB_HOST=' server/.env | cut -d'=' -f2 || echo "localhost")

  if [ -n "$DB_NAME" ] && [ -n "$DB_USER" ]; then
    log "Checking PostgreSQL database '$DB_NAME'..."
    DB_EXISTS=$(psql -U "$DB_USER" -h "$DB_HOST" -d postgres -tAc \
      "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" 2>/dev/null || echo "")

    if [ "$DB_EXISTS" = "1" ]; then
      success "Database '$DB_NAME' already exists"
    else
      log "Creating database '$DB_NAME'..."
      psql -U "$DB_USER" -h "$DB_HOST" -d postgres -c "CREATE DATABASE $DB_NAME;" >/dev/null 2>&1 \
        && success "Database '$DB_NAME' created" \
        || warn "Could not create database — check your DB credentials in server/.env"
    fi
  else
    warn "DB_NAME or DB_USER not set in server/.env — skipping database creation"
  fi
else
  warn "psql not found — skipping database creation. Create it manually."
fi

# ─── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}✅ Setup complete!${RESET}"
echo ""
echo -e "  ${BOLD}Next steps:${RESET}"
echo -e "  1. Edit ${YELLOW}server/.env${RESET} with your DB credentials & JWT secrets"
echo -e "  2. Run ${CYAN}npm run migrate${RESET} inside ${YELLOW}server/${RESET} to apply DB migrations"
echo -e "  3. Run ${CYAN}bash scripts/dev.sh${RESET} to start both servers"
echo ""
