# MLM System Docker Deployment Guide

## Overview

This guide provides instructions for deploying the MLM System using Docker, both locally and on Railway.app. The MLM System is a microservices-based application with the following components:

- **Frontend**: Next.js application
- **API Gateway**: Express.js service that routes requests to microservices
- **User Service**: Handles user authentication and referral logic
- **Admin Service**: Provides administrative functionality

## Prerequisites

- Docker and Docker Compose installed on your local machine
- Git repository cloned locally
- Railway.app account (for cloud deployment)

## Project Structure

```
MLM-System/
├── frontend/                   # Next.js frontend application
├── api-gateway/                # API Gateway service
├── backend/
│   ├── user-service/          # User microservice
│   └── admin-service/         # Admin microservice
├── docker-compose.yml         # Docker Compose configuration
└── README-DOCKER.md           # This file
```

## Local Development with Docker

### Step 1: Set up environment variables

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

### Step 2: Build and start the containers

```bash
docker-compose up --build
```

This will build all the Docker images and start the containers. The services will be available at:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000
- User Service: http://localhost:5001
- Admin Service: http://localhost:5002
- MongoDB: localhost:27017

### Step 3: Verify the services

Check if all services are running properly:

```bash
docker ps
```

You should see containers for frontend, api-gateway, user-service, admin-service, and mongo.

## Deployment to Railway.app

Railway.app is a platform that makes it easy to deploy your applications. Here's how to deploy the MLM System to Railway:

### Step 1: Connect your GitHub repository to Railway

1. Log in to [Railway.app](https://railway.app/)
2. Click "New Project" and select "Deploy from GitHub repo"
3. Select your MLM-System repository

### Step 2: Set up the MongoDB service

1. Click "New Service" → "Database" → "MongoDB"
2. Railway will provision a MongoDB instance and provide connection details

### Step 3: Deploy the microservices

For each service (frontend, api-gateway, user-service, admin-service), you'll need to:

1. Click "New Service" → "GitHub Repo"
2. Select the same repository
3. Configure the service:
   - Set the root directory to the service folder (e.g., `frontend`, `api-gateway`, etc.)
   - Railway will automatically detect the Dockerfile in each directory

### Step 4: Configure environment variables

For each service, go to the "Variables" tab and add the necessary environment variables from the .env.example files. Make sure to:

- Use the MongoDB connection string provided by Railway
- Set consistent JWT_SECRET across all services
- Update service URLs to use Railway's internal networking

#### Key Environment Variables for Railway

**Frontend:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=${{api-gateway.RAILWAY_SERVICE_URL}}
```

**API Gateway:**
```
NODE_ENV=production
ALLOWED_ORIGINS=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}},${{frontend.RAILWAY_SERVICE_URL}}
USER_SERVICE_URL=${{user-service.RAILWAY_SERVICE_URL}}
ADMIN_SERVICE_URL=${{admin-service.RAILWAY_SERVICE_URL}}
JWT_SECRET=your_jwt_secret_here
```

**User Service:**
```
NODE_ENV=production
ALLOWED_ORIGINS=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}},${{api-gateway.RAILWAY_SERVICE_URL}}
MONGO_URI=${{mongodb.MONGODB_URL}}
JWT_SECRET=your_jwt_secret_here
```

**Admin Service:**
```
NODE_ENV=production
ALLOWED_ORIGINS=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}},${{api-gateway.RAILWAY_SERVICE_URL}}
MONGO_URI=${{mongodb.MONGODB_URL}}
JWT_SECRET=your_jwt_secret_here
```

### Step 5: Configure networking

1. Make sure to expose the frontend service to the public by clicking on the service and enabling "Public" in the "Settings" tab
2. The API Gateway should also be exposed if you need direct API access
3. Backend microservices can remain private

### Step 6: Verify deployment

1. Check the deployment logs for each service to ensure they started successfully
2. Visit your frontend URL to verify the application is working
3. Test the API endpoints to ensure the backend services are functioning correctly

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

### Viewing Logs

**Local Docker:**
```bash
# View logs for a specific service
docker logs mlm-api-gateway

# Follow logs in real-time
docker logs -f mlm-frontend
```

**Railway.app:**
Use the Railway web interface or CLI to view logs for each service.

## Adding New Microservices

To add a new microservice to the system:

1. Create a new directory for the service
2. Add a Dockerfile, .dockerignore, and railway.json
3. Update docker-compose.yml to include the new service
4. Update the CI/CD workflow to build and push the new service
5. Deploy the new service to Railway.app

## Backup and Restore

### Backing up MongoDB data

```bash
# Local backup
docker exec -it mlm-mongo mongodump --out=/data/backup

# Copy backup files to host
docker cp mlm-mongo:/data/backup ./backup
```

### Restoring MongoDB data

```bash
# Copy backup files to container
docker cp ./backup mlm-mongo:/data/backup

# Restore from backup
docker exec -it mlm-mongo mongorestore /data/backup
```

## Security Considerations

1. Never commit .env files with sensitive information to the repository
2. Use strong, unique JWT_SECRET values in production
3. Limit MongoDB access to only the necessary services
4. Regularly update dependencies to patch security vulnerabilities

## Performance Optimization

1. Use the multi-stage build in the frontend Dockerfile to reduce image size
2. Enable caching in the API Gateway for frequently accessed data
3. Configure proper indexes in MongoDB for frequently queried fields
4. Use connection pooling for database connections

## Support and Maintenance

For issues or questions about the Docker deployment, please contact the development team or open an issue in the GitHub repository.