FROM node:14

WORKDIR /opt/transference-gateway/api

COPY package*.json ./
COPY . .
COPY .env.sample .env
RUN npm install
RUN npm install sqlite3 --save
RUN npm build

EXPOSE 4531

CMD ["node", "dist/main.js"]