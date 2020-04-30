FROM node:12.16.2-alpine
WORKDIR /usr/app
COPY package.json ./
RUN yarn add global nodemon
COPY . .