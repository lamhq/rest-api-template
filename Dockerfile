FROM node:22.12-alpine AS base
# Install pnpm v10
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN npm install -g pnpm@10.0.0
# Copy code
COPY . /app
WORKDIR /app

# Install production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# API App
FROM base AS api-app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD [ "pnpm", "start" ]

# Migration Runner
FROM base AS migration-runner
COPY --from=build /app/node_modules /app/node_modules
CMD [ "pnpm", "typeorm", "migration:run", "-d", "src/data-source.ts" ]
