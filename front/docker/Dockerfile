FROM node:18-alpine as builder
COPY package.json package-lock.json ./
RUN npm ci
COPY src  ./src
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts .eslintrc.json ./
RUN npx vite build

FROM nginx:1.24-alpine
WORKDIR /app
COPY --from=builder dist ./dist
COPY nginx/default.conf /etc/nginx/nginx.conf.template
CMD /bin/sh -c "envsubst '\$BURL' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
