FROM node:18-alpine as builder
WORKDIR /builder

COPY package.json yarn.lock tsconfig.json ./
COPY src  ./src

RUN yarn && yarn build


FROM node:18-alpine as backend
WORKDIR /app
USER node
ARG ARG_BUILD_VERSION
ENV BUILD_VERSION=ARG_BUILD_VERSION

COPY --from=builder builder/package.json builder/yarn.lock builder/tsconfig.json ./
COPY --from=builder builder/dist/ ./dist
COPY --from=builder builder/node_modules/ ./node_modules

CMD ["node","./dist/main.js"]