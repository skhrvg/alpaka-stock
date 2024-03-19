# alpaka-stock

Сервис проксирования и кэшировани запросов к 1С Alpaka Story.

## Установка на сервер
1. Установите Docker на сервер.
2. Создайте новую директорию.
3. Создайте в ней директорию `certs`.
4. Выпустите или загрузите сертификат домена, на котором будет работать сервис, и поместите его в директорию `certs`.
Должно быть 2 файла: `example.com.crt` и `example.com.key` (где `example.com` - домен сервиса).
5. Создайте в вашей директории файл `docker-compose.yml` (внесите данные на строках 10,14,17,18,20).
```
version: '3.9'
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - /путь/к/вашей/директории/certs:/etc/nginx/certs

  stock:
    container_name: stock
    build: /путь/к/вашей/директории/alpaka-stock/
    restart: unless-stopped
    environment:
      - API_KEY=ключ_для_доступа_к_1С
      - API_URL=http://ip_сервера_1С/unf/hs/stocks/V1/stock
      - PORT=80
      - VIRTUAL_HOST=ваш_домен
```
6. Запустите сервис командой `docker-compose up -d`.

## Обновление
1. Перейдите в директорию с сервисом.
2. Перейдите в директорию `alpaka-stock`.
3. Выполните команду `git pull`.
4. Перейдите в директорию выше.
5. Выполните команду `docker-compose up -d --build`.
