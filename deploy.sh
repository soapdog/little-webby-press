#!/bin/bash

#node ./increment-version.js

VERSION_TAG=v$(cat package.json| jq -r .version)


npm run build
git add -A

git commit -am "deploying $VERSION_TAG"
git tag $VERSION_TAG
git push

echo "Deployed $VERSION_TAG"
