FROM node:alpine as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

RUN npm run build

# Clean npm cache
RUN npm cache clean --force

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia los archivos estáticos generados al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80 para que el contenedor sea accesible
EXPOSE 80

# Inicia Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]