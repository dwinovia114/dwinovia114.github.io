#!/bin/bash
# usage: ./sheet.sh out.png  — stacks every PNG in out/stills (time order) side by side
o=$1; files=$(ls out/stills/*.png | sort); n=$(echo "$files" | wc -l)
ffmpeg -v error -y $(for f in $files; do echo -n "-i $f "; done) -filter_complex "hstack=$n,scale=$((n*320)):-1" $o
