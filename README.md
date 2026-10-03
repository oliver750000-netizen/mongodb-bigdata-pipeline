# MongoDB Big Data Pipeline

Proyecto de Big Data con MongoDB: ingesta, almacenamiento y análisis de grandes volúmenes de datos mediante modelado NoSQL, agregaciones e índices optimizados para entornos escalables.

## Stack tecnológico

- Backend: Node.js + Express
- Base de datos: MongoDB
- Frontend: HTML, CSS, JavaScript
- Autenticación: JWT

## Estructura del proyecto

    api/                 Backend (Express + MongoDB)
      config/            Conexión a MongoDB
      middleware/        Autenticación JWT
      routes/            Endpoints (auth, queries)
      server.js          Punto de entrada

    frontend/            Interfaz web
      css/               Estilos
      js/                Lógica (auth, dashboard, config)
      index.html         Login
      register.html      Registro
      dashboard.html     Panel principal

    queries/             Consultas analíticas (agregaciones MongoDB)
      query_2_1.js ... query_2_4.js
      query_3_1.js ... query_3_4.js

    data/                Datasets (no incluidos por tamaño)

## Instalación y uso

1. Clonar el repositorio:

       git clone https://github.com/oliver750000-netizen/mongodb-bigdata-pipeline.git
       cd mongodb-bigdata-pipeline

2. Instalar dependencias del backend:

       cd api
       npm install

3. Configurar las variables de entorno en `api/.env`:

       MONGO_URI=tu_uri_de_mongodb
       JWT_SECRET=tu_secreto
       PORT=3000

4. Levantar el servidor:

       npm start

5. Abrir el frontend:

   Abrir `frontend/index.html` en el navegador.

## Datasets

Los datasets originales (`airbnb.listingsAndReviews.json` y `flights.csv`) no se incluyen en el repositorio porque superan el límite de 100 MB por archivo de GitHub.

- Airbnb Listings & Reviews: https://www.mongodb.com/docs/atlas/sample-data/sample-airbnb/
- Flights Dataset: https://www.kaggle.com/datasets

## Consultas analíticas

El proyecto incluye consultas de agregación optimizadas:

| Archivo                    | Descripción                                  |
|----------------------------|----------------------------------------------|
| `query_2_1.js` – `query_2_4.js` | Análisis de listings y reseñas de Airbnb |
| `query_3_1.js` – `query_3_4.js` | Análisis de vuelos y rutas               |

## Autor

oliver750000-netizen
https://github.com/oliver750000-netizen