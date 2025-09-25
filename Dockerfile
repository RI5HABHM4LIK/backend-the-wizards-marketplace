# Use official Node.js LTS image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Use Cloud Run port
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
