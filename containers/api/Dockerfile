FROM node:21.3.0-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY    ./backend/package*.json ./
COPY    ./backend/prisma ./prisma
COPY    ./backend/tsconfig.json ./
COPY    ./backend/src ./src
RUN     npx prisma generate
RUN     npm ci
RUN     npm run build
CMD     [ "npm", "run" , "start"]