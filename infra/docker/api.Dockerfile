# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY eslint.config.js ./
COPY .prettierrc.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S cnpjapi -G nodejs

COPY --chown=cnpjapi:nodejs package*.json ./
COPY --from=build --chown=cnpjapi:nodejs /app/dist ./dist
COPY --from=build --chown=cnpjapi:nodejs /app/node_modules ./node_modules

USER cnpjapi

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const port = process.env.PORT || 3000; fetch('http://127.0.0.1:' + port + '/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1));"
  
CMD ["node", "dist/server.js"]
