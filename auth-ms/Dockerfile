FROM node:21-alpine

WORKDIR /app
COPY package*.json .

RUN npm install --production && npm cache clean --force
COPY . .
EXPOSE 3500
CMD ["npm","start"]

#Build:
#docker build -t jhonarias91/auth-ms:v1 .
#docker push jhonarias91/auth-ms:v1