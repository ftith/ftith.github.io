+++
title = 'Docker Compose Tips'
date = 2023-12-20T22:34:17+01:00
draft = true
ShowReadingTime = true
tags = ['docker', 'compose', 'docker compose', 'yaml']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## List deployed docker compose project

## YAML anchor and aliases

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

## Override
```
docker-compose -f Composes\docker-compose.yml -f Composes\docker-compose-aws.yml up
```
test

## Source
- https://docs.docker.com/compose/compose-file/10-fragments/