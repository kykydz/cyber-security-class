#!/bin/bash

curl -X POST \
     -H "authorization: Bearer token123" \
     -H "Content-Type: application/json" \
     -d '{"message": "This is a secret message"}' \
     http://localhost:3001/encrypt
