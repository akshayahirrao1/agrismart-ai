# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching — only reinstalls if
# package.json/package-lock.json actually change)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the backend source
COPY . .

# uploads/ is created automatically at runtime by upload.middleware.js,
# but pre-creating it here avoids a first-request permission surprise
RUN mkdir -p uploads && \
    addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# env.js already validates required env vars at startup and exits(1) with a
# clear message if any are missing — no extra healthcheck logic needed here
CMD ["node", "src/server.js"]