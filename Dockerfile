# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install ffmpeg and Python (needed for yt-dlp)
RUN apk add --no-cache ffmpeg python3 py3-pip curl \
  && pip3 install --break-system-packages yt-dlp \
  && yt-dlp --version

# Copy built Next.js app from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true

# Create /tmp directory for converted audio files
RUN mkdir -p /tmp && chmod 1777 /tmp

# Run as non-root user for security
RUN addgroup -S sonicsync && adduser -S sonicsync -G sonicsync
USER sonicsync

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
