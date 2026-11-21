
FROM node:22-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY services/mock-Interview/package*.json ./services/mock-Interview/
RUN cd services/mock-Interview && npm install


COPY services/mock-Interview ./services/mock-Interview
COPY shared ./shared

WORKDIR /app/services/mock-Interview

EXPOSE 5007

CMD ["npm", "start"]
