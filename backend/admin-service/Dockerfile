FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV REDIS_URL=redis://redis:6379
ENV MONGO_URI=mongodb://mongo:27017/admin_service_db

EXPOSE 5002

CMD ["node", "index.js"]
