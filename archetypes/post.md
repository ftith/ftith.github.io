+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = {{ .Date }}
draft = true
ShowReadingTime = true
[editPost]
URL = "{{ .Site.Params.githubUrl }}/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++
