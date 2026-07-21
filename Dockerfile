# ============================================================
# Grahvani Frontend - Next.js Standalone Dockerfile
# ============================================================

# ---- Stage 1: Install dependencies ----
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: Build ----
FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (NEXT_PUBLIC_* are inlined at build time)
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_USER_SERVICE_URL
ARG NEXT_PUBLIC_CLIENT_SERVICE_URL
ARG GITHUB_TOKEN=""

ENV NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
ENV NEXT_PUBLIC_USER_SERVICE_URL=${NEXT_PUBLIC_USER_SERVICE_URL}
ENV NEXT_PUBLIC_CLIENT_SERVICE_URL=${NEXT_PUBLIC_CLIENT_SERVICE_URL}

RUN mkdir -p /app/curriculum /curriculum ../curriculum && \
    (git clone https://${GITHUB_TOKEN}@github.com/GrahVani/curriculum.git ../curriculum 2>/dev/null || \
     git clone https://github.com/GrahVani/curriculum.git ../curriculum 2>/dev/null || true) && \
    (cp -r ../curriculum/* /app/curriculum/ 2>/dev/null || true) && \
    (cp -r ../curriculum/* /curriculum/ 2>/dev/null || true)

RUN npm run build
RUN mkdir -p /app/curriculum /curriculum && \
    (cp -r ../curriculum/* /app/curriculum/ 2>/dev/null || true) && \
    (cp -r /curriculum/* /app/curriculum/ 2>/dev/null || true)

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV TZ=Asia/Kolkata

WORKDIR /app

# Install curl for Coolify health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 grahvani && \
    adduser --system --uid 1001 grahvani

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder --chown=grahvani:grahvani /app/curriculum ./curriculum

RUN mkdir -p /curriculum && (cp -r ./curriculum/* /curriculum/ 2>/dev/null || true) && chown -R grahvani:grahvani /app /curriculum

USER grahvani

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
