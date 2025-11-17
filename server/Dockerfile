# ------------------------ Build Stage ------------------------
FROM node:20-slim AS build

# user changed to a non-root user inside the container
RUN addgroup --system app && adduser --system --ingroup app app
RUN npm install -g pnpm

USER app

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts --shamefully-hoist 

COPY . .
RUN npx prisma generate
RUN npm run build

# ---------------------- Runtime Stage ----------------------
FROM node:20-slim AS runtime

RUN addgroup --system app && adduser --system --ingroup app app
RUN npm install -g pnpm

USER app

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod --ignore-scripts --shamefully-hoist 

# Copy compiled code & dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views
# docker-compose.yml is not included in the image, instead, it is copied directly to the server inside the ci/cd pipeline as a best practice

RUN npx prisma generate
EXPOSE 5000

CMD ["npm", "start"]