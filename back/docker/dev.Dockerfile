FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY src  ./src
COPY tsconfig.json ./
CMD npm run start:dev