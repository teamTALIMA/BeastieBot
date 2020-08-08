FROM node:12

WORKDIR /app

COPY . . 

RUN yarn build

CMD yarn start 