FROM node:12-alpine3.14

WORKDIR /app
COPY app /app
RUN npm install
RUN npm install -g supervisor
CMD ["supervisor", "dist/index.js"]