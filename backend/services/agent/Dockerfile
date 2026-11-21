
FROM node:22-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY services/agent/package*.json ./services/agent/
RUN cd services/agent && npm install


COPY services/agent ./services/agent
COPY shared ./shared

WORKDIR /app/services/agent

EXPOSE 5003

CMD ["npm", "start"]
