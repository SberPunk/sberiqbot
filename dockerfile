FROM node:18

WORKDIR /app

COPY package*.json ./

# Устанавливаем зависимости без использования кеширования BuildKit
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
