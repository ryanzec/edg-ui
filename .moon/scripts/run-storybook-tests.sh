#!/bin/bash

# Start the server in the background
npx serve storybook-static -p 1337 > /dev/null &

# Get the Process ID (PID) of the server
PID=$!

# Set a trap to kill the server when the script exits for any reason
trap "echo 'Cleaning up server PID $PID' && kill $PID" EXIT

npx wait-on tcp:1337

# Run the tests and store the exit code
./node_modules/.bin/test-storybook --url http://localhost:1337
EXIT_CODE=$?

# Exit the script with the same exit code as the test runner
exit $EXIT_CODE
