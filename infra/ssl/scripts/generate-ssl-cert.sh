#!/bin/bash
# Generate self-signed SSL certificate for development

set -e

CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../dev" && pwd)"
DOMAIN="${DOMAIN:-localhost}"

mkdir -p "$CERT_DIR"

echo "Generating self-signed certificate for $DOMAIN..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN" \
  -addext "subjectAltName=DNS:$DOMAIN,DNS:*.$DOMAIN,IP:127.0.0.1"

echo "Certificate generated:"
echo "  Cert: $CERT_DIR/cert.pem"
echo "  Key:  $CERT_DIR/key.pem"
