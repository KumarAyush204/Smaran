FROM node:alpine3.22
WORKDIR /smaran
COPY modules ./modules
COPY public ./public
COPY views ./views
COPY server.js package.json package-lock.json .
RUN npm install
CMD ["node","server.js"]
