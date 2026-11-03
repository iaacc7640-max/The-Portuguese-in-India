#!/bin/bash
# The three 9:16 Instagram Reels (spec 001-video-16x9 FR-13), rendered in portrait mode from the 16:9 film's timeline: a segment of the film with its own hook line on a torn slip, then the end card
# "Full story on the channel" (2.5 s). Needs data/mix.wav and review/endcard.png (node tools/snap.mjs review/endcard.png "review.html?board=endcard" 1080 1920).
#   bash tools/shorts.sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p renders/reels
ffmpeg -v error -y -loop 1 -framerate 30 -t 2.5 -i review/endcard.png -f lavfi -t 2.5 -i anullsrc=r=48000:cl=stereo \
  -vf "fade=t=in:st=0:d=0.3,format=yuv420p" -c:v libx264 -preset veryfast -crf 18 -c:a aac -b:a 192k -shortest renders/reels/_end.mp4
cut() { # name start end hook
  QS="&portrait=1&hook=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$4")&hs=$2" node tools/capture.mjs video "renders/reels/_$1.mp4" "$2" "$3"
  ffmpeg -v error -y -i "renders/reels/_$1.mp4" -i renders/reels/_end.mp4 -filter_complex \
    "[0:a]afade=t=in:st=0:d=0.3,afade=t=out:st=$(python3 -c "print(round($3-$2-0.6,2))"):d=0.6[a0];[0:v][a0][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "renders/reels/$1.mp4"
  rm -f "renders/reels/_$1.mp4"; echo "renders/reels/$1.mp4 $(ffprobe -v error -show_entries format=duration -of csv=p=0 "renders/reels/$1.mp4") s"
}
cut reel1_calicut 56.62 104.29 "Why a king welcomed Vasco da Gama"
cut reel2_pass 137.13 184.95 "The pass that ruled an ocean"
cut reel3_last 308.34 358.93 "First in, last out"
rm -f renders/reels/_end.mp4
