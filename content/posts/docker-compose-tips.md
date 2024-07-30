+++
title = 'Docker Compose Tips'
date = 2023-12-20T22:34:17+01:00
ShowReadingTime = true
tags = ['docker', 'compose', 'docker compose', 'yaml']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Useful commands
#### List deployed docker compose project
```
docker compose ls
```
#### Cleanup containers and volumes
```
docker compose down -v
```

#### Copy from one volume to another
```
 cp -rp /var/lib/docker/volumes/ftith_opensearch-data1/_data/ /var/lib/docker/volumes/opensearch_opensearch-data1/
```

## YAML anchor and aliases

```
x-common_env: &common_env
  env_file:
    - db.env
services:
  db:
    <<: *common_env
    image: postgres:16.3
  frontend:
    <<: *common_env
    image: nginx:1.27.0-bookworm
```

## Build on the fly
```
services:
  loadbalancer:
    build:
      context: .
      dockerfile: nginx_dockerfile
    ports:
    - "80:80" 
```
command `docker-compose -f Composes\docker-compose.yml up --build`

## Override properties
```
docker-compose -f Composes\docker-compose.yml -f Composes\docker-compose-aws.yml up
```

## Source
- https://docs.docker.com/compose/compose-file/10-fragments/
