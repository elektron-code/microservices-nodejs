FROM node:22-alpine

WORKDIR /transaction

COPY package*.json ./
COPY .env.example .env

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]