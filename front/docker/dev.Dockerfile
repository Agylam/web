FROM node:18-alpine
WORKDIR /app
RUN npm i yarn
COPY package.json yarn.lock ./
RUN yarn
COPY src  ./src
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts .eslintrc.json ./
CMD yarn dev
