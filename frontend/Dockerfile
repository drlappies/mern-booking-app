FROM node:14.17.6-alpine as build

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production

COPY . .

RUN npm run build

FROM nginx:1.21.3-alpine

EXPOSE 3000

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html