#!/bin/bash

# Create a temporary package.json with the dev script
jq '.scripts.dev = "next dev --port 5000 --hostname 0.0.0.0"' package.json > temp-package.json

# Replace the original package.json
mv temp-package.json package.json

# Run the dev command
npm run dev