# K8S
- Create
```kubectl apply -f productsdb-statefulset.yaml```

- Delete

```kubectl delete -f productsdb-statefulset.yaml```
```kubectl delete pvc dbdata-productsdb-statefulset-0```

# Queries
```kubectl exec -it productsdb-statefulset-0 sh```

```mysql -u root -proot -D users_db```


- Direct query
```kubectl exec -it productsdb-statefulset-0 -- mysql -u root -proot -D users_db -e "SELECT * FROM product;"```
