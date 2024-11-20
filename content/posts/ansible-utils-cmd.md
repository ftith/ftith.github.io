+++
title = 'Ansible Utils Commands'
date = 2024-08-23T16:18:08+01:00
ShowReadingTime = true
tags = ['ansible']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

NB: As an example, the machines are defined in file `inventory.yaml` with the following content:
```
# VMs
all:
  hosts:
    vm01:
    vm02:
    vm03:
    vm04:
    vm05:
    vm06:

# Groups
dev:
  hosts:
    vm01:
    vm02:

test:
  hosts:
    vm03:
    vm04:

prod:
  hosts:
    vm05:
    vm06:

# Parent Groups
lan:
  children:
    dev:
    test:
wan:
  children:
    prod:
```

**⚠ If you did not name your inventory file `inventory.yaml` at root folder, you'll need to add the argument `-i <inventory_filename>` to all the commands in the following post.** 

## List hosts from inventory
```
ansible --list-hosts <groups>
```

e.g.
```
# list all hosts
$ ansible --list-hosts all
  hosts (6):
    vm01
    vm02
    vm03
    vm04
    vm05
    vm06

# list a group
$ ansible --list-hosts wan
  hosts (2):
    vm05
    vm06


# list a top group
$ ansible --list-hosts lan
  hosts (4):
    vm01
    vm02
    vm03
    vm04
```

## Run module on specific host or group
e.g.
```
# ping all hosts of group 'wan'
$ ansible -m ping wan
vm05 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
vm06 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}

# execute 'echo world' on host vm01
$ ansible -m shell -a "echo 'hello world'" vm01
vm01 | CHANGED | rc=0 >>
hello world

# print an encrypted variable
$ ansible -m debug -a var=encrypted_var_name localhost --vault-password-file vault_pass.txt
localhost | SUCCESS => {
    "encrypted_var_name": "verystrongpassword"
}
```