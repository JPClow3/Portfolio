# Stage 1 — Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# PUBLIC_* vars are embedded at build time by Astro's Vite pipeline
ARG PUBLIC_WEB3FORMS_ACCESS_KEY
ENV PUBLIC_WEB3FORMS_ACCESS_KEY=$PUBLIC_WEB3FORMS_ACCESS_KEY

RUN npm run build

# Stage 2 — Serve
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
