# Setup base image, installing security updates and setting env vars
FROM node:23-bookworm-slim AS base
RUN apt update -y && apt full-upgrade -y
ENV NODE_ENV=production
ENV PORT=3006

# Install corepack and pnpm
FROM base AS corepack
WORKDIR /workdir
RUN corepack enable && corepack install -g pnpm@10.0.0

# Install prod dependencies
FROM corepack AS prod-deps
WORKDIR /workdir
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/
COPY client/package.json client/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Install dev dependencies
FROM corepack AS build-deps
WORKDIR /workdir
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/
COPY client/package.json client/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build stage
FROM corepack AS build
WORKDIR /workdir
COPY --from=build-deps /workdir/node_modules ./node_modules
COPY --from=build-deps /workdir/server/node_modules ./server/node_modules
COPY --from=build-deps /workdir/client/node_modules ./client/node_modules
COPY . .
RUN pnpm run build

# Prod image stage
FROM base
WORKDIR /workdir
COPY --from=build /workdir/server/dist ./server/dist
COPY --from=build /workdir/client/dist ./client/dist

EXPOSE ${PORT}

# Set the user so this doesn't run as root
USER node

# Run node directly -- not an npm command
CMD ["node", "server/dist/server.js"]
