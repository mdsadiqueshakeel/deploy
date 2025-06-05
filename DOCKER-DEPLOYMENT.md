# Docker Deployment Guide for MLM System

## Local Docker Deployment

### Prerequisites
- Docker and Docker Compose installed on your machine
- Git repository cloned locally

### Steps for Local Deployment

1. **Set up environment variables**

   Copy the example environment files to create your actual .env files:

   ```bash
   cp frontend/.env.example frontend/.env
   cp api-gateway/.env.example api-gateway/.env
   cp backend/user-service/.env.example backend/user-service/.env
   cp backend/admin-service/.env.example backend/admin-service/.env
   ```

   Edit each .env file to set your actual values, especially:
   - JWT_SECRET (use the same value across all services)
   - MONGO_URI (for local development, the docker-compose.yml already sets this correctly)
   - Email credentials if needed

2. **Build and start the containers**

   ```bash
   docker-compose up --build
   ```

   This will build all the Docker images and start the containers. The services will be available at:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:5000
   - User Service: http://localhost:5001
   - Admin Service: http://localhost:5002
   - MongoDB: localhost:27017

3. **Seed the database (optional)**

   If you need to seed the database with initial data:

   ```bash
   docker exec -it mlm-user-service npm run seed
   ```

## Deployment to Railway.app

Railway.app is a platform that makes it easy to deploy your applications. Here's how to deploy the MLM System to Railway:

### Prerequisites
- A Railway.app account (free tier available)
- Your project pushed to GitHub

### Steps for Railway Deployment

1. **Connect your GitHub repository to Railway**

   - Log in to [Railway.app](https://railway.app/)
   - Click "New Project" and select "Deploy from GitHub repo"
   - Select your MLM-System repository

2. **Set up the services**

   For each service (frontend, api-gateway, user-service, admin-service), you'll need to:

   - Click "New Service" → "GitHub Repo"
   - Select the same repository
   - Configure the service:
     - Set the root directory to the service folder (e.g., `frontend`, `api-gateway`, etc.)
     - Railway will automatically detect the Dockerfile in each directory

3. **Add a MongoDB database**

   - Click "New Service" → "Database" → "MongoDB"
   - Railway will provision a MongoDB instance and provide connection details

4. **Configure environment variables**

   For each service, go to the "Variables" tab and add the necessary environment variables from the .env.example files. Make sure to:

   - Use the MongoDB connection string provided by Railway
   - Set consistent JWT_SECRET across all services
   - Update service URLs to use Railway's internal networking

5. **Deploy the services**

   Railway will automatically deploy your services when you push changes to your GitHub repository.

### Important Railway.app Configuration Notes

1. **Service URLs in Railway**

   When services communicate within Railway, they can use internal service URLs. Update these environment variables:

   - In api-gateway:
     ```
     USER_SERVICE_URL=${{user-service.RAILWAY_SERVICE_URL}}
     ADMIN_SERVICE_URL=${{admin-service.RAILWAY_SERVICE_URL}}
     ```

   - In frontend:
     ```
     NEXT_PUBLIC_API_URL=${{api-gateway.RAILWAY_SERVICE_URL}}
     ```

2. **Exposing services**

   - Make sure to expose the frontend service to the public
   - The API Gateway should also be exposed if you need direct API access
   - Backend microservices can remain private

3. **MongoDB connection**

   Use the Railway-provided MongoDB connection string in your services:

   ```
   MONGO_URI=${{mongodb.RAILWAY_MONGO_CONNECTION_STRING}}
   ```

## CI/CD Pipeline

The project includes a GitHub Actions workflow in `.github/workflows/ci-cd.yml` that automatically builds and pushes Docker images to Docker Hub when changes are pushed to the main branch.

To use this workflow:

1. Add your Docker Hub credentials as GitHub repository secrets:
   - DOCKER_USERNAME
   - DOCKER_PASSWORD

2. Push changes to the main branch to trigger the workflow

3. The workflow will build and push images for all services

## Troubleshooting

### Common Issues

1. **Services can't connect to each other**
   - Check environment variables for service URLs
   - Ensure services are on the same Docker network

2. **MongoDB connection issues**
   - Verify the MongoDB connection string
   - Check if MongoDB container is running

3. **Frontend can't connect to API**
   - Ensure NEXT_PUBLIC_API_URL is set correctly
   - Check CORS configuration in the API Gateway

### Logs

To view logs for a specific service:

```bash
# Local Docker
docker logs mlm-api-gateway

# Railway.app
# Use the Railway CLI or web interface to view logs
```