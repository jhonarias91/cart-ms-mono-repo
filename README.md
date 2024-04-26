# cart-ms-mono-repo
"# cart-ms-mono-repo" 

# Minikube
- Install minukube
- run it: ```minikube start```

Verifica el current:
kubectl config get-contexts

# K8S 

- Cambiar de contexto:
- kubectl config use-context <nombre-contexto>
Verificar el context
```kubectl config get-contexts```
```kubectl get namespaces```

Crear context


_Name space para dev_

- kubectl create namespace dev

## K8S GCP
- Conectarse a GCP, crea un contexto, que es donde se guardan las configuraciones, apunta a un enviroment distinto

- ```gcloud container clusters get-credentials cart-ms-autopilot-1 --region us-central1 --project cart-ms-auth-ms```

- __Crud de contexts__
- ```kubectl config```

# Common Isssues

- => CANCELED [backend internal] load build context   
    -   Delete volumen .dbdata and temp files like: CANCELED, transfering, etc at root level.

- error: error validating "usersdb-statefulset.yaml": error validating data: failed to download openapi: Get "https://127.0.0.1:50230/openapi/v2?timeout=32s": EOF; if you choose to ignore these errors, turn validation off with --validate=false

    - ```minikube delete```
    - ```minikube start```

- EAI_AGAIN  : es un error del DNS.

- Firebase domain not auth
    Agregar la external ip de react a los autorizados en firebase.

- Cache, docker image
    Cuando se hace un cambio poner una version que no exista en k8s, mostrar un cambio en el log inicial apra verificar que toma la íltima version.
## States
- CrashLoopBackOff: error al iniciar el container.

    # Comands

### Info comands
- all pods
```kubectl get pods```
- Info de un pod
```kubectl describe pod usersdb-statefulset-0```
- List pods (front, back, external)
```kubectl get pods -l area=external``` 

- list logs 
```kubectl logs usersdb-statefulset-0```

### Deployment comands

- Run config
```kubectl apply -f usersdb-statefulset.yaml```
- Editar un deployment
```kubectl edit usersdb-statefulset-0```

- Interact mode:
```kubectl exec -it users-ms-deployment-54f9f5d47c-rg4zp sh```

### Delete
- Delete a pod

```kubectl delete pods users-ms-deployment-54f9f5d47c-rg4vq```
