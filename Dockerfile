# ------------------------------------------
# Stage 1: Build the application
# ------------------------------------------
    FROM node:23-slim AS builder

    # Install build tools for native packages if needed
    RUN apt-get update && apt-get install -y build-essential
    
    WORKDIR /usr/src/app
    
    # Copy dependency files and install everything
    COPY package*.json ./
    RUN npm install
    
    # Copy source code and build the app
    COPY . .
    RUN npm run build
    
    # ------------------------------------------
    # Stage 2: Run the built app
    # ------------------------------------------
    FROM node:23-slim
    
    WORKDIR /usr/src/app
    
    # Install only production dependencies
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy built app from builder stage
    COPY --from=builder /usr/src/app/dist ./dist
    
    # Copy other necessary files (optional)
    # COPY .env .env
    
    EXPOSE 3000
    
    # Start the app
    CMD ["node", "dist/main.js"]
    