Задача разбита по уровням(level). Все уровни хранятся на отдельных ветках


###LVL 1-2###
Для запуска ничего не требуется. Клонируем ветку и запускаем на live сервере

###LVL 3###
Для этого уровня должен быть установлен node.js, а также express cors и body-parser
(npm install express cors body-parser)
для запуска нужно ввести node server.js

###LVL 4### 
Для работы должен быть установлен sqlite 
(npm install sqlite3 sequelize)

###LVL 5###
Для работы с докером нуже docker-compose 
Он устанавливается автоматически с Docker Desctop

Ссылка на работающий экземпляр приложения https://reon-chi.vercel.app/
Сслка на докер образ в хабе:

сервер - https://hub.docker.com/r/ramenformom/server
фронтенд - https://hub.docker.com/r/ramenformom/frontend

для сборки и запуска нужно ввести docker-compose up --build
