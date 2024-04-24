# K8S
- Create
```kubectl apply -f usersdb-statefulset.yaml```

- Delete

```kubectl delete -f usersdb-statefulset.yaml```

### Métricas
Instalar metrics
```kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml```
- Verificar instalación:

```kubectl get pods -n kube-system```

# minikube
minikube service usersdb

- Instalar metrics:
- kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

- Si no corre el metrics usar:
    minikube delete
    minikube start --apiserver-ips=192.168.49.2

    o desactivar la valdiación del sans.
    -   ```kubectl edit deployment metrics-server -n kube-system```
    Añade el flag bajo spec.template.spec.containers.args:
    - - --kubelet-insecure-tls

# StatefulSet
- StatefulSet: Es más adecuando para app que requieran mantener el estado y los datos.
- PersistentVolumeClaim (PVC ):  Es un columen que son estables y consistentes a través 
de los reinicios del pod. Esto significa que si un pod es eliminado o reprogramado, 
se puede reasociar con su volumen persistente sin problemas, manteniendo intactos los datos.