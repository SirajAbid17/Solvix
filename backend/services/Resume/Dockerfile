
FROM node:22-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY services/Resume/package*.json ./services/Resume/
RUN cd services/Resume && npm install


COPY services/Resume ./services/Resume
COPY shared ./shared

WORKDIR /app/services/Resume

EXPOSE 5004

CMD ["npm", "start"]
