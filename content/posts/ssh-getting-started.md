+++
title = 'SSH Getting Started'
date = 2024-02-21T15:35:20+01:00
tags = ['ssh']
ShowReadingTime = true
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Generate key
```
ssh-keygen -t ed25519 -C "your_email@example.com"
```

## Copy key to server
```
ssh-copy-id -i .ssh/id_ed25519.pub <server_name>
```

## Connect to server
```
ssh -i ~/.ssh/id_ed25519 <user>@<server_name>
```

## Sources
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key