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
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate
RUN npm run build

# ---------------------- Runtime Stage ----------------------
FROM node:20-slim AS runtime

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN addgroup --system app && adduser --system --ingroup app app
RUN npm install -g pnpm

# --- FIX START: Create logs directory and assign permissions ---
# We must do this as root before switching to USER app
RUN mkdir -p /app/logs && chown -R app:app /app/logs
# --- FIX END ---

USER app

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod --ignore-scripts --shamefully-hoist 

# Copy compiled code & dependencies
# Note: It is good practice to verify ownership, but since app only reads these, 
# standard copy is usually fine. If you have issues, add --chown=app:app
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate
EXPOSE 5000

CMD ["npm", "start"]