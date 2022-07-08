FROM node:lts-bullseye-slim

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
ENV NODE_ENV=production

COPY package.json /app
COPY yarn.lock /app/yarn.lock

RUN apt update && apt install chromium -y && apt clean
RUN yarn
RUN yarn global add pm2

COPY index.js /app/index.js
COPY logger.js /app/logger.js
COPY src /app/src
COPY config /app/config
COPY public /app/public

EXPOSE 8080

CMD ["pm2-runtime", "index.js"]
