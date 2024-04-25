FROM node:21-alpine

WORKDIR /app
COPY package*.json .
RUN npm install && npm cache clean --force
COPY . .

EXPOSE 8000

CMD npm start
