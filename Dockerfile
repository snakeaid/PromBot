FROM node:18.15-alpine
COPY . .

RUN npm install
RUN npm run build

ENTRYPOINT [ "node", "built/server.js" ]
EXPOSE 5000
