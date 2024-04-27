# K8S
- Create
```kubectl apply -f usersdb-statefulset.yaml```

- Delete

```kubectl delete -f usersdb-statefulset.yaml```
```kubectl delete pvc dbdata-usersdb-statefulset-0```


# StatefulSet
- StatefulSet: Es más adecuando para app que requieran mantener el estado y los datos.
- PersistentVolumeClaim (PVC ) -  volumeClaimTemplates:  Es un volumen que son estables y consistentes a través 
de los reinicios del pod. Esto significa que si un pod es eliminado o reprogramado, 
se puede reasociar con su volumen persistente sin problemas, manteniendo intactos los datos.
ReadWriteOnce: Lectura y escritura para un solo nodo.

# Issues

- Se hay error con el volumen, está corrupto o no se puede iniciar mysql

```kubectl delete pvc dbdata-usersdb-statefulset-0```

# test connection
```kubectl run -it --rm --image=mysql:8 mysql-client -- mysql -h usersdb-service -u root -prootH```

# Queries
```kubectl exec -it usersdb-statefulset-0 sh```
```mysql -u root -proot -D users_db```
```kubectl exec -it usersdb-statefulset-0 -- mysql -u root -proot -D users_db -e "SELECT * FROM user;"```
