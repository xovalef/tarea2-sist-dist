# Tarea 2 Sistemas Distribuidos

## Integrantes

- Rodrigo Alvarez

- Valeria Fuentes

### Como ejecutar

Para ejecutar este proyecto de una manera "sencilla", necesitas instalar [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/).

Basta con ejecutar:

```sh

docker-compose up

```

---

### Variables de entorno

En el repositorio existe un archivo `.env` de ejemplo, el cual tiene las configuraciones por default (KAFKA_HOST) que será la referencia al broker de kafka al que deseamos conectarnos con nuestra aplicación.

---

### Login

Este proyecto levantará una API rest en el puerto `3000` la cual tiene una unica ruta **`/login`** la que solo responde a request del tipo **POST**. A este endpoint se le debe mandar en el body del request el user y la password de la cuenta a la que deseamos ingresar.

#### **Ejemplo:**

**ruta:**

```
http://localhost:3000/login [POST]
```

**body:**

```json
{
  "user": "test@gmail.com",
  "pass": 1234
}
```

Tendrá una respuesta similar a:

```json
{
  "login": true
}
```

---

### Security

También se levantará una API rest en el puerto `5000` la cual tiene una unica ruta **`/blocked`** la que solo responde a request del tipo **`GET`** . Este endpoint responderá con la lista de usuarios que se encuentran bloqueados.

#### **Ejemplo:**

**ruta:**

```
http://localhost:5000/blocked [GET]
```

Tendrá una respuesta similar a:

```json
{
  "users -blocked": ["test@gmail.com", "example@gmail.com"]
}
```
