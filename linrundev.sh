#!/bin/bash

# Start servers
sudo npm start --prefix my-faithpal_server &
sudo npm start --prefix my-faithpal_server/socket &
sudo npm start --prefix my-faithpal_ai_server &
sudo npm start --prefix my-faithpal_ai_server/socket &

# Wait for servers to start
sleep 5 # Adjust this if necessary

# Run Faithpal
sudo npm run dev --prefix my-faithpal

echo "Success servers should be running"
