# K8S
- Deploy image

```docker build -t jhonarias91/auth-ms:v10 .```
```docker push jhonarias91/auth-ms:v10```

- Create

```kubectl apply -f auth-ms-config.yaml```

```kubectl apply -f auth-ms-deployment.yaml```
    
- Delete

```kubectl delete -f auth-ms-config.yaml```

```kubectl delete -f auth-ms-deployment.yaml```


