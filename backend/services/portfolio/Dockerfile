
FROM node:22-bookworm-slim

WORKDIR /app


COPY package*.json ./
RUN npm install --include=optional


COPY services/portfolio/package*.json ./services/portfolio/
RUN cd services/portfolio && npm install --include=optional


RUN cd services/portfolio && npm install --no-save --include=optional --os=linux --cpu=x64 --libc=glibc @napi-rs/canvas-linux-x64-gnu@0.1.80


COPY services/portfolio ./services/portfolio
COPY shared ./shared

WORKDIR /app/services/portfolio


RUN node -e "require('@napi-rs/canvas'); console.log('CANVAS NATIVE BINDING LOADED')"

EXPOSE 5005

CMD ["npm", "start"]
