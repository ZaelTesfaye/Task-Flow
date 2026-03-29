# Build Stage
FROM node:20-slim AS build

RUN addgroup --system app && adduser --system --ingroup app app
RUN npm install -g pnpm

USER app

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
ENV HUSKY=0
RUN --mount=type=cache,target=/home/app/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN npx prisma generate

RUN npm run build





# Runtime Stage
FROM node:20-slim AS runtime

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system app && adduser --system --ingroup app app
RUN npm install -g pnpm

USER app
WORKDIR /app
RUN mkdir -p /app/logs

COPY package*.json pnpm-lock.yaml ./
ENV HUSKY=0
RUN --mount=type=cache,target=/home/app/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Copy compiled code & dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views

RUN pnpm dlx prisma generate
EXPOSE 5000

CMD ["npm", "start"]