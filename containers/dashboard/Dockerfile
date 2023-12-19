FROM node:18.18-alpine as builder

ENV NODE_ENV=development

WORKDIR /app

COPY ./frontend/dashboard/package*.json ./

RUN npm ci
COPY ./frontend/dashboard/src ./src
COPY ./frontend/dashboard/public ./public
COPY ./frontend/dashboard/vite.config.js ./
COPY ./frontend/dashboard/index.html ./
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY containers/dashboard/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app
COPY containers/dashboard/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]