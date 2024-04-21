+++
title = 'Troubleshoot Wsl Issues'
date = 2024-04-21T09:35:43+02:00
tags = ['wsl', 'ssh', 'mode', 'troubleshooting']
ShowReadingTime = true
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Change mode/rights of Windows files in WSL
### Symptoms:
By default, if you try to chmod your files hosted on windows in WSL, it won't change anything e.g. 
```
ls -l /mnt/c/userid/.ssh/vault_pass.txt
-rwxrwxrwx 1 userid userid 34 Nov 22 14:21 /mnt/c/userid/.ssh/vault_pass.txt
chmod 400 /mnt/c/userid/.ssh/vault_pass.txt
ls -l /mnt/c/userid/.ssh/vault_pass.txt
-rwxrwxrwx 1 userid userid 34 Nov 22 14:21 /mnt/c/userid/.ssh/vault_pass.txt
```
It can be particularly painful for keys since they cannot be too permissive e.g. for a ssh key
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0777 for '/home/userid/.ssh/id_ed25519' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/home/userid/.ssh/id_ed25519": bad permissions
Permission denied (publickey).
```
or for a password file in ansible
```
[WARNING]: Error in vault password file loading (default): Problem running vault password script ./vault_pass.txt ([Errno 8] Exec format error:
'./vault_pass.txt'). If this is not a script, remove the executable bit from the file.
ERROR! Problem running vault password script ./vault_pass.txt ([Errno 8] Exec format error: './vault_pass.txt'). If this is not a script, remove the executable bit from the file.
```
### Solution: 

You need to change (or create) your file `/etc/wsl.conf` to that configuration: 
```
[automount]
options = "metadata"
mountFsTab = true
```
Then restart WSL:
```
wsl --shutdown
mount -a
```

Afterwards, you will be able to change the mode of the file
```
chmod 400 .ssh/id_ed25519
```

## Docker daemon not running
### Symptoms:
```
docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

### Solution: 
Switch to iptables-legacy, to change the default iptables version.
```
  sudo update-alternatives --config iptables
```
Then re-start docker service
```
  sudo service docker start
```
And check docker status again with
```
  sudo service docker status
```
Source: https://github.com/docker/for-linux/issues/1406