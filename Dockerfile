FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .

ENV PORT=8080

EXPOSE 8080

ENV NODE_ENV=$NODE_ENV

CMD ["npm","start"]