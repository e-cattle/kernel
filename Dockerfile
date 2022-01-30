FROM node:lts-alpine
WORKDIR /usr/app
COPY package.json ./
RUN yarn add global nodemon
COPY . .