#!/bin/bash

BUILD_DIR="${1:-storybook-static}"
PORT=1337

# pre-flight: refuse to start if the port is already taken so we don't run the test runner against an unrelated server
EXISTING_PID="$(lsof -iTCP:"$PORT" -sTCP:LISTEN -P -t 2>/dev/null | head -1)"
if [ -n "$EXISTING_PID" ]; then
  echo "error: port $PORT is already in use by PID $EXISTING_PID" >&2
  echo "       run 'lsof -iTCP:$PORT -sTCP:LISTEN -P' to inspect, then kill it before re-running" >&2
  exit 1
fi

# start the server in the background; stdout/stderr stay attached so real errors (port-in-use, missing build, etc.) are visible
npx serve "$BUILD_DIR" -p "$PORT" > /dev/null &
PID=$!

# npx often spawns the real `serve` as a child and exits, leaving the child orphaned if we only kill $PID — pkill children first, then $PID
cleanup() {
  echo "Cleaning up server PID $PID"
  pkill -P "$PID" 2>/dev/null || true
  kill "$PID" 2>/dev/null || true
}
trap cleanup EXIT

npx wait-on tcp:"$PORT"

# liveness check: if our server (or its child) didn't actually bind, wait-on may have succeeded against something else — fail loudly
if ! kill -0 "$PID" 2>/dev/null && [ -z "$(pgrep -P "$PID" 2>/dev/null)" ]; then
  echo "error: server process $PID exited before tests could start" >&2
  exit 1
fi

# Run the tests and store the exit code
./node_modules/.bin/test-storybook --url http://localhost:"$PORT"
EXIT_CODE=$?

# Exit the script with the same exit code as the test runner
exit $EXIT_CODE
