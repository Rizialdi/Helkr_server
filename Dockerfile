FROM node:13

WORKDIR /usr/src/app

COPY . .

RUN yarn

CMD [ "yarn", "start" ]
