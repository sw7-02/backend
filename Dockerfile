# Preparation and creation stage
# Using a builder stage in order to cache npm installs on seperate stage
FROM node:alpine3.17 as init

# Set current user to non-root in current working directory
WORKDIR /dist
RUN chown node:node ./
#RUN apk add libressl-dev
# RUN apk add openssl-dev
#RUN apk add openssl1.1-compat
RUN apk add --update --no-cache openssl1.1-compat
#RUN apk update && apk upgrade openssl
USER node

# This stage is strictly for development dependencies
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Copy package confs to builder and make a clean install
COPY package*.json ./
COPY prisma ./prisma/
COPY /.env ./
RUN npm ci -D && npm cache clean --force
RUN npx prisma generate

# Copy src and tsconfig on seperate layers as src is highly volatile to changes
COPY src/ ./src/
COPY tsconfig.json ./
# runs rimraf and tsc dev devdependencies and requires tsconfig.json for tsc
RUN npm run build

# The runtime stage
FROM node:alpine
RUN apk add --update --no-cache openssl1.1-compat

# Defaults to production, docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Set current user to non-root in current working directory
WORKDIR /app
RUN chown node:node ./
USER node

# Copy the distribution files from the builder to the working directory
COPY --from=init /dist ./
COPY healthcheck.js ./

# Install production dependencies
RUN npm ci && npm cache clean --force
# RUN npx prisma generate

# Port to expose which can be overwritten with docker-compose
ARG PORT=80
EXPOSE $PORT

ARG STATUS_PATH=/api/v1/status

# Setup healthcheck
HEALTHCHECK --interval=10s --timeout=2s --start-period=15s \
    CMD PORT=$PORT STATUS_PATH=$STATUS_PATH node /app/healthcheck.js

# Execute NodeJS (not NPM script) to handle SIGTERM and SIGINT signals.
CMD ["node", "./build/index.js"]
