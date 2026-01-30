#!/bin/bash
# Free port 3000 (and optionally 3001, 3002, 80) for Docker Compose

echo "Checking what's using ports 3000, 3001, 3002, 80..."
echo ""

for PORT in 3000 3001 3002 80; do
  # macOS: lsof -i :PORT
  PID=$(lsof -ti :$PORT 2>/dev/null)
  if [ -n "$PID" ]; then
    echo "Port $PORT is in use by PID(s): $PID"
    echo "  Process: $(ps -p $PID -o comm= 2>/dev/null)"
    echo "  To free port $PORT, run: kill $PID"
    echo "  Or to force: kill -9 $PID"
    echo ""
  fi
done

# If port 3000 specifically, offer to kill
PID_3000=$(lsof -ti :3000 2>/dev/null)
if [ -n "$PID_3000" ]; then
  echo "Free port 3000 now? (y/n)"
  read -r answer
  if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    kill $PID_3000 2>/dev/null && echo "Killed process on 3000." || kill -9 $PID_3000 2>/dev/null && echo "Force-killed process on 3000."
  fi
fi
