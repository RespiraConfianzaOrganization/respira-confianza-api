FROM debian:stable-slim

WORKDIR /app

COPY . /app

RUN apt update -y

RUN apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 nodejs npm -y && npm install yarn -g && curl --compressed -o- -L https://yarnpkg.com/install.sh | bash && yarn

EXPOSE 8080

CMD ["yarn", "run", "dev"]
