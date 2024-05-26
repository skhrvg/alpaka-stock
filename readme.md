# alpaka-stock

Сервис проксирования и кэшировани запросов к 1С Alpaka Story.

## Установка на сервер
1. Установите Docker на сервер.
2. Создайте новую директорию.
3. Создайте в вашей директории файл `docker-compose.yml` (внесите данные на строках 19,30,33,34,36,37).
```
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - conf:/etc/nginx/conf.d
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - certs:/etc/nginx/certs:ro
    restart: unless-stopped
  
  acme-companion:
    image: nginxproxy/acme-companion
    container_name: nginx-proxy-acme
    environment:
      - DEFAULT_EMAIL=ваш_email
    volumes_from:
      - nginx-proxy
    volumes:
      - certs:/etc/nginx/certs:rw
      - acme:/etc/acme.sh
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: unless-stopped

  stock:
    container_name: stock
    build: /путь/к/вашей/директории/alpaka-stock/
    restart: unless-stopped
    environment:
      - API_KEY=ключ_для_доступа_к_1С
      - API_URL=http://ip_сервера_1С/unf/hs/stocks/V1/stock
      - PORT=80
      - VIRTUAL_HOST=ваш_домен
      - LETSENCRYPT_HOST=ваш_домен

volumes:
  conf:
  vhost:
  html:
  certs:
  acme:
```
6. Запустите сервис командой `docker-compose up -d`.

## Обновление
1. Перейдите в директорию с сервисом.
2. Перейдите в директорию `alpaka-stock`.
3. Выполните команду `git pull`.
4. Перейдите в директорию выше.
5. Выполните команду `docker-compose up -d --build`.
