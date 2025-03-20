#! /bin/bash

YTDLP_URL="https://github.com/yt-dlp/yt-dlp/releases/download/2025.02.19/yt-dlp.exe"

FFMPEG_URL="https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"

mkdir -p ../resources

rm -rf ../resources/*

cd ../resources/

curl -O -L ${YTDLP_URL}
curl -O -L ${FFMPEG_URL}

unzip \*.zip

rm -rf *.zip

mv ffmpeg-master-latest-win64-gpl/bin/ffplay.exe ffplay.exe
mv ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe ffmpeg.exe

rm -rf ffmpeg-master-latest-win64-gpl

