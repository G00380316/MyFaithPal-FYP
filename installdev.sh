#!/bin/bash

# Store the current directory
CURRENT_DIR=$(pwd)

# Install packages for my-faithpal_server
echo "Installing packages for my-faithpal_server..."
cd my-faithpal_server
npm install
cd "$CURRENT_DIR"

# Install packages for my-faithpal_server/socket
echo "Installing packages for my-faithpal_server/socket..."
cd my-faithpal_server/socket
npm install
cd "$CURRENT_DIR"

# Install packages for my-faithpal_ai_server
echo "Installing packages for my-faithpal_ai_server..."
cd my-faithpal_ai_server
npm install
cd "$CURRENT_DIR"

# Install packages for my-faithpal_ai_server/socket
echo "Installing packages for my-faithpal_ai_server/socket..."
cd my-faithpal_ai_server/socket
npm install
cd "$CURRENT_DIR"

# Wait for servers to start
sleep 10 # Adjust this if necessary

# Install dependencies for Faithpal
echo "Installing dependencies for my-faithpal..."
cd my-faithpal
npm install
cd "$CURRENT_DIR"

# Wait for Faithpal installation
sleep 10

# Run servers after
#bash rundev.sh
