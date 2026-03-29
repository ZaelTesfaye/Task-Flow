# Build Stage
FROM node:20-slim AS build

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system app && adduser --system --ingroup app app
RUN npm install -g pnpm@9

USER app

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
ENV HUSKY=0
RUN --mount=type=cache,target=/home/app/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --config.shamefully-hoist=false

COPY . .
RUN pnpm exec prisma generate

RUN npm run build
RUN pnpm prune --prod





# Runtime Stage
FROM node:20-slim AS runtime

RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system app && adduser --system --ingroup app app

USER app
WORKDIR /app
RUN mkdir -p /app/logs

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy compiled code & dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views

EXPOSE 5000

CMD ["npm", "start"]