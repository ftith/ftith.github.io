+++
title = 'Curl with credentials'
date = 2025-04-17T16:03:08+01:00
ShowReadingTime = true
tags = ['docker', 'curl', 'credentials']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Curl with basic authentication user
```
curl --user USER:PASSWORD https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```
## Curl with basic authentication as Header
Encode your credentials in base64 first then pass it to your curl command:
```
# Encode your credentials
$ echo 'USER:PASSWORD' | base64                                                                                     
VVNFUjpQQVNTV09SRAo=

# Pass it to your curl command
$ curl -H "authorization: Basic VVNFUjpQQVNTV09SRAo="  https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json

# Note that you can also decode your base64 encoded credentials this way
```$ echo -n VVNFUjpQQVNTV09SRAo= | base64 -d                                                                                  
USER:PASSWORD
```

You can also pass the command directly in your curl command:
```
curl -H "authorization: Basic $(echo 'USER:PASSWORD' | base64)"  https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```
Windows/Powershell equivalent 
```
# Powershell
Invoke-Web-Request -Uri 'https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json' -Headers @{ Authorization = "Basic "+ [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("USER:PASSWORD")) } |  Select-Object -Expand Content
```
## Curl with bearer token 
```
# Get the bearer token from your authentication provider. e.g. for Azure AD:
$ curl -X POST -d 'grant_type=client_credentials&client_id=<your_client_id>client_secret=<your_client_secret>&resource=api:<resource_app_id>' https://login.microsoftonline.com/<your_tenant_id>/oauth2/token

# Pass it to your curl command
$ curl -H "authorization: Bearer <access_token>"  https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json
```
> Note: bearer tokens has an expiration time so you'll need to refresh it from time to time. 

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
> ⚠ Never use clear credentials in your Dockerfile (e.g. `curl -u user:pwd https://raw.githubusercontent.com/cplee/github-actions-demo/refs/heads/master/package.json`), since anyone can read them with command ` docker history --no-trunc <image_name>`

## Sources
- https://stackoverflow.com/questions/56284902/how-to-add-credentials-to-docker-add-command
- https://xanderx.com/post/using-netrc-with-curl-for-automatic-authorisation/
- https://docs.docker.com/build/ci/github-actions/secrets/
