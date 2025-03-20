#! /bin/bash

npx esbuild --format=cjs --bundle --platform=node ../index.ts --outfile=main.js

npm install -g pkg 
pkg -t node*-win-x64 main.js -o main-win
# pkg -t node*-linux-x64 main.js -o main-linux
# pkg -t node*-macos-x64 main.js -o main-macos