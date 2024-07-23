# Используем базовый образ Node.js
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package.json  ./

# Устанавливаем зависимости (например, http-server)
RUN npm install

# Копируем все остальные файлы проекта
COPY . .

# Устанавливаем простой HTTP сервер
RUN npm install -g http-server

# Экспонируем порт
EXPOSE 5000

# Команда для запуска HTTP сервера
CMD ["http-server", "-p", "5000"]