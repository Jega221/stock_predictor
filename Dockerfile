# ── Stage 1: Build the React application ──
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install clean dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the production bundle into /app/dist
RUN npm run build

# ── Stage 2: Serve with lightweight Nginx ──
FROM nginx:alpine

# Copy built static files from builder stage to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
