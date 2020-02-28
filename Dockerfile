FROM node:13

WORKDIR /usr/src/app

COPY . .

RUN yarn

EXPOSE 3000 27017

CMD [ "yarn", "start" ]