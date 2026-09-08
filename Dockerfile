# Base Node Image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json for caching purpose
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source files
# First . means ( Current build context on my machine )
# Second . means ( Current working directory inside the image )
COPY . .

# Start development server
CMD ["npm", "run", "dev"]