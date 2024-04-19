## Run

- docker-compose up 

## Considerations

- La bd tiene un volumen, entonces se debe borrar si se quieren regenerar datos con una nueva build (check)
 delete .dbdata

# Run containers con docker

- Se debe crear una red para acceder mediante el nombre del host (container_name)
```docker network create users-network```

- ambassador backend
 - Update the STRIPE_SECRET en .env  por la private key de stripe: https://dashboard.stripe.com/test/apikeys
 - Crear la imágen
 
   ```docker-compose up```

  - Si el ambassador se va a correr localmente se deben cambiar ormconfig.json host:"localhost" o a "db" si va a container
    hacer lo mismo para redis en index.ts y rankings.ts

    Desde el container de ambassador correr los seeds: 
    ```docker exec -it ambassador sh```
    ```npm run run:seeders```
      or     
    - ```npm run seed:ambassadors && npm run seed:products && npm run seed:links && npm run seed:orders && npm run update:rankings```

# TypeOrm

Al tener varias instancias del mismo MS, se debe desactivar:  "synchronize": false en ormconfig.json

 - Crear archivo de migración:
 ```npx typeorm migration:create -n updateUserAndLink```

 - Agregar allí los scripts de up and down
  - up: se ejecuta cuando se quiere crear tablas nuevas sin perder las existentes, para agregar columnas, inserts, deletes, etc
    para correr el me´todo up se utiliza: se debe configurar la traspilación    
    ```npx typeorm migration:run```

  - down: es lo inverso al up, se usa para revertir cambios, eliminar tablas creadas, revertir datos, cuando hay algún error en migración
    para ejecutar el down se usa: se debe configurar la traspilación
    ```npx typeorm migration:revert```

  - En una sola réplica del MS correr la migración o en un step del pipeline despues que levante la bd y antes del MS.
    se corre el scrip typeorm para traspilar el ts
    ```npm run typeorm migration:run```

- Crear la data: ```npm run seeders```
