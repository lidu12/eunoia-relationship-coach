# Stage 1: Build & Bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy source code
COPY . .

# Build Vite frontend & bundle server.ts with esbuild
RUN npm run build

# Stage 2: Production Execution
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled dist from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]
