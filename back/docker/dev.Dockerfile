FROM node:18-alpine
WORKDIR /app
RUN npm install yarn
COPY package.json yarn.lock ./
RUN yarn
COPY src  ./src
COPY tsconfig.json ./
CMD yarn start:dev