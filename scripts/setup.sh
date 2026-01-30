#!/bin/bash

set -e

echo "Setting up Resume Intelligence Platform..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { 
    echo "pnpm is required but not installed."
    echo "Install with: npm install -g pnpm"
    exit 1
}
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting." >&2; exit 1; }

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check pnpm version
PNPM_VERSION=$(pnpm -v | cut -d'.' -f1)
if [ "$PNPM_VERSION" -lt 8 ]; then
    echo "pnpm 8+ is required. Current version: $(pnpm -v)"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update .env with your configuration"
fi

# Create necessary directories
echo "Creating directories..."
mkdir -p uploads
mkdir -p exports
mkdir -p infra/postgres/backups

# Install dependencies
echo "Installing dependencies with pnpm..."
pnpm install

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env file with your configuration"
echo "  2. Build all packages: pnpm build"
echo "  3. Start infrastructure: pnpm docker:dev"
echo "  4. Start services: pnpm dev"
echo ""
echo "For more information, see README.md"
