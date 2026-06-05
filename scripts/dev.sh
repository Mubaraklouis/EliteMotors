#!/usr/bin/env bash
# ============================================================
# EliteMotors — Dev Start Script
# Starts the Express API server and the React client together.
# Usage: bash scripts/dev.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║     EliteMotors — Starting Dev       ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════╝${RESET}"
echo ""

# ─── Guard: dependencies installed? ─────────────────────────
if [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
  echo -e "${YELLOW}[!]${RESET} Dependencies not installed. Running setup first..."
  bash scripts/setup.sh
fi

# ─── Guard: server .env exists? ──────────────────────────────
if [ ! -f "server/.env" ]; then
  echo -e "${RED}[✘]${RESET} server/.env not found."
  echo -e "     Run ${CYAN}bash scripts/setup.sh${RESET} first."
  exit 1
fi

echo -e "${CYAN}[dev]${RESET} Starting servers..."
echo -e "  ${GREEN}►${RESET} Client  → ${BOLD}http://localhost:5173${RESET}"
echo -e "  ${GREEN}►${RESET} Server  → ${BOLD}http://localhost:5001${RESET}"
echo -e "  ${GREEN}►${RESET} Health  → ${BOLD}http://localhost:5001/api/health${RESET}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers.${RESET}"
echo ""

npm run dev
