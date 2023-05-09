FROM node:18.15-alpine3.16

RUN mkdir -p /srv/app/frontend
WORKDIR /srv/app/frontend

COPY package.json /srv/app/frontend
COPY package-lock.json /srv/app/frontend

RUN npm ci

COPY . /srv/app/frontend

CMD ["npm", "run", "dev"]
