FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
RUN echo '{"name":"app","version":"1.0.0","description":"","main":"index.js","scripts":{"start":"node server.js"},"dependencies":{}}' > package.json
RUN npm install express body-parser cors

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY . .
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["npm", "start"]