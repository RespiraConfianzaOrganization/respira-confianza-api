FROM node:18

WORKDIR /app

COPY . /app/

RUN yarn

EXPOSE 8000

CMD ["npm", "run", "dev"]
