+++
title = 'Curl with credentials'
date = 2025-04-17T16:03:08+01:00
draft = true
ShowReadingTime = true
tags = ['docker', 'curl', 'credentials']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Curl with basic authentication user
```
curl USER:PASSWORD https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```

## Curl with netrc file
```
touch ~/.netrc
echo "machine github.com login MY_USERNAME password MY_PASSWORD" > ~/.netrc
curl -o /tmp/package.json --netrc-file ~/.netrc https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```


## Curl with netrc file within a Dockerfile
Docker command in your dockerfile:
```
RUN --mount=type=secret,id=curl \
    curl -o /tmp/package.json --netrc-file /run/secrets/curl https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```

Build your dockerfile passing your credentials
```
export CURL_CREDS="machine github.com login MY_USERNAME password MY_PASSWORD"
docker build --secret id=curl,env=CURL_CREDS .
```

## Curl with netrc file within a Dockerfile in github actions
Workflow
```
- name: Build and Push Docker Image (only for prod and preprod env)
  uses: https://github.com/docker/build-push-action@v4
  with:
    context: .
    push: ${{ github.event_name != 'pull_request' && (env.TARGET_ENV == 'prod' || env.TARGET_ENV == 'preprod') }}
    secrets: |
      "curl=default ${{ vars.DOMAIN }} login ${{ secrets.USERNAME }} password ${{ secrets.PASSWORD }} protocol https"
```

Docker command in your dockerfile:
```
RUN --mount=type=secret,id=curl \
    curl -o /tmp/package.json --netrc-file /run/secrets/curl https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```


## Sources
- https://stackoverflow.com/questions/56284902/how-to-add-credentials-to-docker-add-command
- https://xanderx.com/post/using-netrc-with-curl-for-automatic-authorisation/
- https://docs.docker.com/build/ci/github-actions/secrets/
