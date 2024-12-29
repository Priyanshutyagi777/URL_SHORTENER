
# FROM node:18-alpine as builder

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy source code
# COPY . .

# # Production image
# FROM node:18-alpine

# WORKDIR /app

# # Copy package files and install production dependencies
# COPY package*.json ./
# RUN npm ci --only=production

# # Copy built application
# COPY --from=builder /app/src ./src
# COPY --from=builder /app/.env.example ./.env

# # Set environment variables
# ENV NODE_ENV=production

# # Expose port
# EXPOSE 3000

# # Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD node -e "require('http').request({ host: 'localhost', port: 3000, path: '/health', timeout: 2000 }, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1)).end()"

# # Start application
# CMD ["node", "index.js"]




# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the entire source code from the repository root
COPY . .

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the necessary built application files
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production

# Expose the port used by the application
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').request({ host: 'localhost', port: 3000, path: '/health', timeout: 2000 }, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1)).end()"

# Command to start the application
CMD ["node", "index.js"]
