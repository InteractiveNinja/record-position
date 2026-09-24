FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build the app (dummy DATABASE_URL needed because the db module throws at import time;
# the real value is read from the environment at runtime)
ARG CI_COMMIT_SHA
ENV CI_COMMIT_SHA=$CI_COMMIT_SHA
COPY . .
RUN DATABASE_URL=postgres://build:build@localhost:5432/build npm run build

# Remove dev dependencies and install only production dependencies
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]
