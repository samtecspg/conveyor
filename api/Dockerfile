FROM node:10.4.1-alpine

# progress=false stops npm from slowing to show a progress bar (because can't be seen in docker anyway)
RUN npm set progress=false && \
    npm config set depth 0

RUN npm install -g yarn

RUN mkdir /usr/src && mkdir /usr/src/app && mkdir /usr/src/data

# Dockerize is used to set the startup order in the main compose that uses this image
RUN apk add dockerize --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

WORKDIR /usr/src/app
COPY package.json package-lock.json yarn.lock ./
RUN yarn install

# Copy this whole directory into /usr/src/app

COPY . .

CMD ["node", "start.js"]
