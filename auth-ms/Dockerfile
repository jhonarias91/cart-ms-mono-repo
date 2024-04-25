FROM node:21-alpine

WORKDIR /app
COPY package*.json .

RUN npm install --production && npm cache clean --force
COPY . .
EXPOSE 3500
CMD ["npm","start"]

