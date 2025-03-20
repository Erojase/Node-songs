#!/usr/bin/env zsh

npx esbuild --format=cjs --bundle --platform=node ../index.ts --outfile=main.js