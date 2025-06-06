FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install cross-env globally
RUN npm install -g cross-env

RUN npm install --production

COPY . .

EXPOSE 5001

CMD ["npm", "start"]