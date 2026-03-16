FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Angular >=17 (@angular/build:application) place les fichiers statiques dans dist/<app>/browser
COPY --from=build /app/dist/engins-front/browser /usr/share/nginx/html

EXPOSE 80
