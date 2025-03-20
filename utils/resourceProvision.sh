#!/usr/bin/env zsh

YTDLP_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"

FFMPEG_URL="https://evermeet.cx/ffmpeg/ffmpeg-118819-g5ad86d5fbc.zip"

FFPLAY_URL="https://evermeet.cx/ffmpeg/ffplay-118608-g25c439296b.zip"

mkdir -p ../resources

rm -rf ../resources/*

cd ../resources/

curl -O -L ${YTDLP_URL}
curl -O -L ${FFMPEG_URL}
curl -O -L ${FFPLAY_URL}

unzip \*.zip

rm -rf *.zip

chmod +x ./yt-dlp_macos
chmod +x ./ffmpeg
chmod +x ./ffplay

