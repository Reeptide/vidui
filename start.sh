#!/usr/bin/env bash
# Start lightweight local server for VidCompress Demo
PORT=8000

echo "=========================================================="
echo " 🚀 VidCompress Demo Server"
echo " Open in your browser: http://localhost:${PORT}"
echo " Press Ctrl+C to stop."
echo "=========================================================="

# Try opening default browser in background
(sleep 0.6 && (xdg-open "http://localhost:${PORT}" 2>/dev/null || open "http://localhost:${PORT}" 2>/dev/null)) &

if command -v python3 &>/dev/null; then
  python3 -m http.server ${PORT}
elif command -v python &>/dev/null; then
  python -m http.server ${PORT}
else
  echo "Notice: Python not found. You can also double click index.html directly!"
fi
