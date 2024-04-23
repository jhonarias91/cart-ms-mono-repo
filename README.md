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



# Isssues

- => CANCELED [backend internal] load build context   
    -   Delete volumen .dbdata and temp files like: CANCELED, transfering, etc at root level.