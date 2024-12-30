# Create an image with same node version as in development
FROM node:20 AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Create a new image with only the build files 
FROM node:20

# Copy the build files and node_modules
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Run the app
CMD ["node", "build/index.js"]