# ------------------------ Build Stage ------------------------
FROM node:18-alpine AS build

# change the user to non-root user inside the container
RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ---------------------- Runtime Stage ----------------------
FROM node:18-alpine AS runtime

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code & dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public

RUN npx prisma generate

CMD ["node", "dist/index.js"]