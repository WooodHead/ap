#!/bin/bash

nohup docker run -v ${PWD}:/opt/agentpanel -v /opt/agentpanel/frontend/node_modules -v /opt/agentpanel/backend/node_modules -p 4200:4200 -p 3000:3000 --name ap1container --rm ap1 > dev-be-nohup.out &

until docker ps | grep ap1container;
do
    sleep .5
done

nohup docker exec -i ap1container npm run start:dev --prefix frontend > dev-fe-nohup.out &

tail -f dev-be-nohup.out