FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src  ./src
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts .eslintrc.json ./
RUN npm run dev