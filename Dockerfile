FROM ubuntu

WORKDIR /app

COPY . /app

RUN apt update -y
RUN apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 -y
RUN apt install nodejs -y
RUN apt install npm -y
RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev"]
