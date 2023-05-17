FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src  ./src
COPY tsconfig.json ./
RUN npm run dev