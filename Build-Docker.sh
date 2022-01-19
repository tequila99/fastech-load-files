#!/bin/sh

cd front
yarn install 
yarn start:build
cp -R dist/spa/* ../back/public
cd ../back
docker build --tag=fastech .

    
