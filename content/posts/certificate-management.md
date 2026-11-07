+++
title = 'Certificate Management'
date = 2026-11-02T21:55:43+01:00
ShowReadingTime = true
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

Here are some useful commands I use regularly for certificates management. 

## Generate a self-signed certificate
```bash
openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 -keyout node_exporter.key -out node_exporter.crt -subj "/CN=*.domain.com" -addext "subjectAltName = DNS:*.domain.com"
```

## Generate a full chain certificate 
```bash
cat domain.com{,_intermediate}.cer > domain.com_full.cer
# or: if file is missing a newline
awk 1 domain.com.cer domain.com_intermediate.cer > domain.com_full.cer 
```

## Check the Status of a Certificate
```bash
openssl x509 -in mycert.pem -text -noout
```

## Determine SSL cert expiration date
```bash
openssl x509 -enddate -noout -in /etc/ssl/private/lan.domain.cer
```

## Check either certificate is expired at a given date (in second)
```bash
openssl x509 -checkend 2592000 -in cert.crt
```

## Check server certificate
```bash
openssl s_client -host www.google.com -port 443
```