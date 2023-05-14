[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд
[Ссылка на репозиторий](https://github.com/ri-yarm/express-mesto-gha)

# Стек
  * Простая документация через JSDoc
  * NodeJs
    * midlewares
  * Express
    * Helmet
    * Express-rate-limit
    * celebrate
      * Joi
  * Mongoose
    * Schema
    * validator


## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
