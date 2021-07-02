FROM node:14.17.1
WORKDIR /usr/src
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]