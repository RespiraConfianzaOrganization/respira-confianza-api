FROM debian:stable-slim

WORKDIR /app

COPY . /app

RUN apt update -y && \
    apt install -y libnss3-dev \
        libgbm-dev \
        libasound2 \
        nodejs \
        npm && \
    npm install yarn -g && \
    curl --compressed -o- -L https://yarnpkg.com/install.sh | bash && \
    yarn

EXPOSE 8080

CMD ["yarn", "run", "dev"]
