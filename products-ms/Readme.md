## Products-ms
# K8S 
- Deploy image

```docker build -t jhonarias91/products-ms:v9 .```
```docker push jhonarias91/products-ms:v9```

- Create K8S

```kubectl apply -f products-ms-config.yaml```
```kubectl apply -f products-ms-deployment.yaml```


- Migration
```npm run typeorm migration:run```

- Delete

```kubectl delete -f products-ms-config.yaml```
```kubectl delete -f products-ms-deployment.yaml```

# TypeOrm

 - Crear archivo de migración:
 ```npx typeorm migration:create -n products_migration```

  - Ejecutar el script de migración, conectar por terminal a un pod:

    ```npm run typeorm migration:run```

    ```npm run seed:products```

    para eliminar
    
    ```npm run typeorm migration:revert```
