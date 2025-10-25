# ------------------------ Build Stage ------------------------
FROM node:18-alpine AS build

# user changed to a non-root user inside the container
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
COPY --from=build /app/views ./views
COPY --from=build /app/nginx.conf ./nginx.conf
# docker-compose.yml is not included in the image, instead, it is copied directly to the server inside the ci/cd pipeline as a best practice

RUN npx prisma generate

CMD ["node", "npm start"]