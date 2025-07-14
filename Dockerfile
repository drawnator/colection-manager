FROM node:24-alpine

RUN mkdir /app

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm","run","dev"]