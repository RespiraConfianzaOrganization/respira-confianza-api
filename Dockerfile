FROM node:18

WORKDIR /app

COPY . /app

RUN yarn

EXPOSE 8080

CMD ["npm", "run", "dev"]
