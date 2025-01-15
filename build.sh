#!/bin/bash

rm -rf public
rm -rf breaklock

npm install
npm run build

mv public breaklock
