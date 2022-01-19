#!/bin/sh

cd front
yarn install 
yarn start:build
cp -R dist/spa/* ../back/public
cd ../back
yarn install
yarn start
    
