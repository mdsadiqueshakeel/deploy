# MongoDB Atlas Setup for MLM System

## Overview

This guide explains how the MLM System has been configured to use MongoDB Atlas instead of a local MongoDB container. MongoDB Atlas is a fully-managed cloud database service that handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice.

## Current Configuration

The `docker-compose.yml` file has been updated to use MongoDB Atlas with the following connection string:

```
mongodb+srv://AffilateProduction:Ranjan123@affilateproduction.thjqoek.mongodb.net/MLM_DB?retryWrites=true&w=majority&appName=AffilateProduction
```

This connection string is used by both the user-service and admin-service to connect to the MongoDB Atlas cluster.

## Security Note

**Important:** The connection string contains sensitive information (username and password). In a production environment, it's recommended to:

1. Use environment variables or a secrets management solution instead of hardcoding credentials in the docker-compose.yml file
2. Restrict network access to your MongoDB Atlas cluster to only allow connections from trusted IP addresses
3. Use a more complex password and consider implementing database user roles with appropriate permissions

## Running the Application

To run the application with MongoDB Atlas:

1. Ensure Docker and Docker Compose are installed on your system
2. Navigate to the project root directory
3. Run the following command:

```bash
docker-compose up --build
```

This will build and start all the services defined in the docker-compose.yml file. The services will connect to MongoDB Atlas using the provided connection string.

## Verifying the Connection

To verify that the services are connecting to MongoDB Atlas correctly:

1. Check the logs of the user-service and admin-service containers:

```bash
docker logs mlm-user-service
docker logs mlm-admin-service
```

2. Look for messages indicating a successful connection to MongoDB

## Troubleshooting

If you encounter connection issues:

1. **Network Issues**: Ensure your network allows outbound connections to MongoDB Atlas
2. **Authentication Issues**: Verify the username and password in the connection string
3. **IP Whitelist**: Check if your IP address is whitelisted in the MongoDB Atlas network access settings
4. **Database Name**: Ensure the database name in the connection string (MLM_DB) is correct

## Migrating Data

If you need to migrate data from a local MongoDB to MongoDB Atlas:

1. Export data from your local MongoDB:

```bash
mongodump --uri="mongodb://localhost:27017/MLM_DB" --out=./dump
```

2. Import data to MongoDB Atlas:

```bash
mongorestore --uri="mongodb+srv://AffilateProduction:Ranjan123@affilateproduction.thjqoek.mongodb.net/MLM_DB" ./dump/MLM_DB
```

## MongoDB Atlas Dashboard

You can manage your MongoDB Atlas cluster through the web dashboard:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in with your credentials
3. Navigate to your project and cluster

From the dashboard, you can:
- Monitor database performance
- Manage database users
- Configure network access
- Set up backups
- Scale your cluster as needed

## Railway.app Deployment

When deploying to Railway.app, you should set the `MONGO_URI` environment variable in the Railway dashboard for each service that needs to connect to MongoDB Atlas. This keeps your credentials secure and makes it easy to update the connection string if needed.