# AgylamWebFront

## Установка и запуск

Для установки и запуска проекта введите:

```cmd
npm i --legacy-peer-deps
npm run dev
```
---

### Для запуска внутри docker-контейнера:
Build можно делать только при первом запуске.
```cmd
docker build -f docker/Dockerfile -t agylam/front .
docker run agylam/front
```
##### *Agylam - проект по автоматизации школьных звонков. Он состоит из сайта, с помощью которого можно управлять расписанием и python-скрипта, звенящего сами звонки.