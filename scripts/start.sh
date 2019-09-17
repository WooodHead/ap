#!bin/bash

port="${1:-3005}"
bh="${2:-}"

npm i --prefix backend
npm i --prefix frontend

cd frontend && npm run build:prod

if [[ ! -z $bh ]]; then
    cd ../backend && node ./setBaseHref.js --bh $bh
fi

cd ../backend && npm run start:dev
