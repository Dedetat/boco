FROM node:9-slim

EXPOSE 3000
VOLUME /app/db

ENV DB_PATH=/app
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g pnpm

COPY package.json shrinkwrap.yaml ./
RUN pnpm install --production

COPY . ./

CMD [ "node", "." ]
