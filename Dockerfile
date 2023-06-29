# Specify the base image and version
FROM node:14

# Set the working directory inside the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your Express.js application is listening on
EXPOSE 3000

# Start the Express.js application
CMD ["node", "app.js"]
