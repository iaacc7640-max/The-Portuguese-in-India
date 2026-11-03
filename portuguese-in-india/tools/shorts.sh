#!/bin/bash
# The three 9:16 Shorts cut-downs: a segment of the film with its own hook line on a torn slip, then the end card
# "Full story on the channel" (2.5 s). Needs data/mix.wav and review/endcard.png (node tools/snap.mjs review/endcard.png "review.html?board=endcard" 1080 1920).
#   bash tools/shorts.sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p renders/shorts
ffmpeg -v error -y -loop 1 -framerate 30 -t 2.5 -i review/endcard.png -f lavfi -t 2.5 -i anullsrc=r=48000:cl=stereo \
  -vf "fade=t=in:st=0:d=0.3,format=yuv420p" -c:v libx264 -preset veryfast -crf 18 -c:a aac -b:a 192k -shortest renders/shorts/_end.mp4
cut() { # name start end hook
  QS="&hook=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$4")&hs=$2" node tools/capture.mjs video "renders/shorts/_$1.mp4" "$2" "$3"
  ffmpeg -v error -y -i "renders/shorts/_$1.mp4" -i renders/shorts/_end.mp4 -filter_complex \
    "[0:a]afade=t=in:st=0:d=0.3,afade=t=out:st=$(python3 -c "print(round($3-$2-0.6,2))"):d=0.6[a0];[0:v][a0][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "renders/shorts/$1.mp4"
  rm -f "renders/shorts/_$1.mp4"; echo "renders/shorts/$1.mp4 $(ffprobe -v error -show_entries format=duration -of csv=p=0 "renders/shorts/$1.mp4") s"
}
cut short1_calicut 54.79 100.89 "Why a king welcomed Vasco da Gama"
cut short2_pass 131.90 177.92 "The pass that ruled an ocean"
cut short3_last 296.95 346.18 "First in, last out"
rm -f renders/shorts/_end.mp4
