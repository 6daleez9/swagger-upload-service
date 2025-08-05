FROM node:21-alpine

WORKDIR /src/app

# Copy package files and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of your application
COPY . .

EXPOSE 5000

CMD [ "node", "app.js" ]
