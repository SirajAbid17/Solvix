
FROM node:22-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY services/auth/package*.json ./services/auth/
RUN cd services/auth && npm install


COPY services/auth ./services/auth
COPY shared ./shared

WORKDIR /app/services/auth

EXPOSE 5001

CMD ["npm", "start"]
