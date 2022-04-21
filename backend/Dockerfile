FROM node:14.17.6-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production

COPY . .

EXPOSE 8080

CMD npm run start