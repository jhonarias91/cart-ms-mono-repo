# K8S
- Deploy image

```docker build -t jhonarias91/auth-ms:v1 .```
```docker push jhonarias91/auth-ms:v1```

- Create

```kubectl apply -f auth-deployment.yaml```

- Delete

```kubectl delete -f auth-deployment.yaml```

