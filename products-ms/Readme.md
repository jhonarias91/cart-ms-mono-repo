## Run

- docker-compose up 

## Considerations

- La bd tiene un volúmen, entonces se debe borrar si se quieren regenerar datos con una nueva build

# Run containers con docker

- Se debe crear una red para acceder mediante el nombre del host (container_name)
```docker network create ambassador-network```

    Pull following images and run container:
    - redis
  ```docker pull redis```
  ```docker run -p 6379:6379 -d --name redis --network my-network redis```

    - mysql
  ```docker pull mysql```
  ```docker run -p 3306:3306 -d --name db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=ambassador --network my-network mysql```
    - -e MYSQL_ROOT_PASSWORD: el parámetro -e establece una variable de entorno en el container
    - -e MYSQL_DATABASE=ambassador: crea una bd llamada ambassador

  - mailhog
    ```docker pull mailhog/mailhog```
    # Expose the SMTP and HTTP ports: EXPOSE 1025 8025
    ```docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog```
    
    Connect: localhost:8025

  Para revisar los datos:
  - ```docker exec -it db sh```
   ```mysql -u root -p```
    ```use db ambassador;```
     ```select * from product;```
     
- ambassador backend
 - Update the STRIPE_SECRET en .env  por la private key de stripe: https://dashboard.stripe.com/test/apikeys
 - Crear la imágen
   ```docker build -t ambassador  .```
   ```docker rm -f ambassador && docker run -d -p 8000:8000 --name ambassador -d  --network my-network ambassador```

  - Si el ambassador se va a correr localmente se deben cambiar ormconfig.json host:"localhost" o a "db" si va a container
    hacer lo mismo para redis en index.ts y rankings.ts

    Desde el container de ambassador correr los seeds: 
    ```docker exec -it ambassador sh```
    ```npm run run:seeders```
      or     
    - ```npm run seed:ambassadors && npm run seed:products && npm run seed:links && npm run seed:orders && npm run update:rankings```

    - react projects

  Si saca error de code: 'ERR_OSSL_EVP_UNSUPPORTED.

    start": "set NODE_OPTIONS=--openssl-legacy-provider "

    - Next-checjout
      - Go to stripe to get the publishable key: https://dashboard.stripe.com/test/apikeys
      - ```npm run dev```

# Run docker-compose

- ```docker network create ambassador-network```
- 