#!/bin/bash

cd samples
for i in */; do (cd "$i"; zip -r "../${i%/}.zip" .); done
mv *.zip ../files/
cd ..
