FROM node:lts-slim

WORKDIR /workspace

RUN apt-get update && apt-get install -y git && npm install -g pnpm@latest
