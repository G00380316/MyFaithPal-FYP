#!/bin/bash

# Start servers
npm start --prefix my-faithpal_server &
npm start --prefix my-faithpal_server/socket &
npm start --prefix my-faithpal_ai_server &
npm start --prefix my-faithpal_ai_server/socket &

# Wait for servers to start
sleep 5 # Adjust this if necessary

# Run Faithpal
npm run dev --prefix my-faithpal

echo "Succes servers should be running"
