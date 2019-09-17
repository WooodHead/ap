#!/bin/bash

cp /etc/voicespin-apps/config.json .

docker build -t ap1 -f Dockerfile.dev .

rm config.json
