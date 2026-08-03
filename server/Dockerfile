# Build Stage
FROM node:20-slim AS build

RUN npm install -g pnpm

USER node

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
ENV HUSKY=0
RUN --mount=type=cache,target=/home/node/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate

RUN pnpm run build





# Runtime Stage
FROM node:20-slim AS runtime

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

USER node
WORKDIR /app
RUN mkdir -p /app/logs

COPY package*.json pnpm-lock.yaml ./
ENV HUSKY=0
RUN --mount=type=cache,target=/home/node/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Copy compiled code & dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views
COPY --from=build /app/generated ./generated

EXPOSE 5000

CMD ["npm", "start"]