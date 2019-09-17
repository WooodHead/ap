FROM node:10.16.0

ARG HOST_IP="set_me"
ENV HOST_IP $HOST_IP

ARG VOICEAPP_ENV_DIALER_URL="set_me"
ENV VOICEAPP_ENV_DIALER_URL $VOICEAPP_ENV_DIALER_URL

ADD . /opt/agentpanel
WORKDIR /opt/agentpanel
RUN mkdir /etc/voicespin-apps
COPY config.json /etc/voicespin-apps/
RUN apk add gettext libintl tzdata \
 && mkdir -p /usr/local/sbin \
 && mv /usr/bin/envsubst /usr/local/sbin/ \
 && cd backend \
 && npm install \
 && npm run build \
 && npm prune -- production \
 && cd ../frontend \
 && npm install \
 && npm run build:prod \
 && cd ../backend \
 && rm -rf dist/src/dist \
 && mv src/dist dist/src/dist \
 && find . -name '*.js.map' -delete \
 && cd ../ \
 && sed -i "s/localhost/$\{HOST_IP\}/g" /etc/voicespin-apps/config.json \
 && sed -i"" /\"dialer\""/s/: {/: {\n \t\"dialerUrl\": \"$\{VOICEAPP_ENV_DIALER_URL\}\","/ /etc/voicespin-apps/config.json \
 && cp /etc/voicespin-apps/config.json /etc/voicespin-apps/config.json.src
CMD envsubst < /etc/voicespin-apps/config.json.src > /etc/voicespin-apps/config.json && ln -sf /usr/share/zoneinfo/${TIME_ZONE} /etc/localtime && dpkg-reconfigure -f noninteractive tzdata&& cd backend && npm run start:dev
