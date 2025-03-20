#!/usr/bin/env zsh

npx esbuild --format=cjs --bundle --platform=node ../index.ts --outfile=main.js

# then npm install -g pkg and pkg main.js