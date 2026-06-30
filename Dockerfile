FROM node:20-slim

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Install client dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Copy server source
COPY server/ ./server/

# Copy root package.json
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "server/server.js"]
