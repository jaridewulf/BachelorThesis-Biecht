FROM node:18.18-alpine as builder

ENV NODE_ENV=development

WORKDIR /app

COPY ./frontend/opinions-projector/package*.json ./

RUN npm ci
COPY ./frontend/opinions-projector/src ./src
COPY ./frontend/opinions-projector/public ./public
COPY ./frontend/opinions-projector/vite.config.js ./
COPY ./frontend/opinions-projector/index.html ./
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY containers/projection/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app
COPY containers/projection/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]