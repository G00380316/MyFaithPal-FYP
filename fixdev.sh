#!/bin/bash

# Store the current directory
CURRENT_DIR=$(pwd)
#comment out the line with npm if you don't want to run fix for that file

# Install packages for my-faithpal_server
echo "Fixing packages for my-faithpal_server..."
cd my-faithpal_server
#npm audit fix
cd "$CURRENT_DIR"

# Fix packages for my-faithpal_server/socket
echo "Installing packages for my-faithpal_server/socket..."
cd my-faithpal_server/socket
#npm audit fix
cd "$CURRENT_DIR"

# Fix packages for my-faithpal_ai_server
echo "Fixing packages for my-faithpal_ai_server..."
cd my-faithpal_ai_server
npm audit fix
cd "$CURRENT_DIR"

# Fix packages for my-faithpal_ai_server/socket
echo "Installing packages for my-faithpal_ai_server/socket..."
cd my-faithpal_ai_server/socket
#npm audit fix
cd "$CURRENT_DIR"

# Wait for servers to start
sleep 10 # Adjust this if necessary

# Fix dependencies for Faithpal
echo "Installing dependencies for my-faithpal..."
cd my-faithpal
#npm audit fix
cd "$CURRENT_DIR"

# Wait for Faithpal the Fix
sleep 10

echo "Completed"

