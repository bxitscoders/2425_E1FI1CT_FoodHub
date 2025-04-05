# Use the Bun image as the base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
COPY package.json bun.lock /usr/src/app/
RUN bun install --frozen-lockfile

# Build the Svelte app
FROM base AS build
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .
RUN bun run build

# Prepare the final production image
FROM base AS release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules

# Serve the Svelte app by running index.js
USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "./build/index.js"]
