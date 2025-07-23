# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the API Gateway
CMD ["node", "src/index.js"]
