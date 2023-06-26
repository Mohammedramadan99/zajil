# Use a suitable base image
FROM node:18

# Set the working directory
WORKDIR /app

COPY . .
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install --unsafe-perm --ignore-scripts=false

# Start the application
CMD [ "npm", "run", "prod" ]
