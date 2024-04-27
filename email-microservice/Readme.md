# K8S
- Deploy image

```docker build -t jhonarias91/email-ms:v1 .```
```docker push jhonarias91/email-ms:v1```

- Create

```kubectl apply -f email-ms-config.yaml```

```kubectl apply -f email-ms-deployment.yaml```

- Delete

```kubectl delete -f email-ms-config.yaml```

```kubectl delete -f email-ms-deployment.yaml```


