# React users
## K8S
- Deploy image

```docker build -t jhonarias91/react-users:v6 .```

```docker push jhonarias91/react-users:v6```

- Create

```kubectl apply -f react-users-deployment.yaml```

- Delete

```kubectl delete -f react-users-config.yaml```
```kubectl delete -f react-users-deployment.yaml```




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Docker
docker build -t jhonarias91/react-users:v2 .
docker push jhonarias91/react-users:v2
docker run -p4000:80 --name react-users jhonarias91/react-users:v2

_ Eliminar container e image
```docker compose down --rmi all```
# K8S

- Create

kubectl apply -f react-users-deployment.yaml

- Delete

kubectl delete -f react-users-deployment.yaml

- Listar

kubectl get pods -l area=front

# Minikube
minikube service react-users
