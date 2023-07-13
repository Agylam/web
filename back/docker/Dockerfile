FROM node:18-alpine as builder
WORKDIR /builder

COPY package.json package-lock.json tsconfig.json ./
COPY src  ./src

RUN npm ci && npm run build



FROM node:18-alpine as backend
WORKDIR /app
USER node
ARG ARG_BUILD_VERSION
ENV BUILD_VERSION=ARG_BUILD_VERSION

COPY --from=builder  builder/package.json builder/package-lock.json builder/tsconfig.json ./
COPY --from=builder builder/build/ ./build
COPY --from=builder builder/node_modules/ ./node_modules

CMD ["node","./build/index.js"]