#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

npm run build

cd gh-pages

git add .
git commit -m "Rebuilding site `date`"
git push gh-pages gh-pages
