+++
title = 'Ansible Data Structures'
date = 2023-12-18T23:16:42+01:00
ShowReadingTime = true
tags = ['ansible', 'list', 'dictionary']

[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++
## Type of data structures
Since Ansible is based on Python. There are two main data structures in Ansible: list and dictionary. 
## List
### Initialization of a list
```
  - name: Initialize an empty list
    set_fact:
      list: []
```
Result is: `{"list": []}`
### Append element to a list
```
  - name: Append element to list
    set_fact:
      list: "{{ list + [ 'element_1' ] }}"
```
Result is: `{"list": ["element_1"]}`
### Append multiple elements to a list
```
  - name: Get list of files in current directory
    shell: "ls"
    register: ls_files
  - name: Append filtered elements (only yaml file) to list
    set_fact:
      list: "{{ list + [ item ] }}"
    loop: "{{ ls_files.stdout_lines }}"
    when: "'yaml' in item"
```
Result is: `{"list": ["element_1", "list.yaml"]}` if your current directory is for instance composed of:
- test.yml
- list.yaml
- roles/
### Remove element from list
```
  - name: Remove element from list
    set_fact:
      list: "{{ list | difference([ 'element_1' ]) }}"
```
Result is: `{"list": ["list.yaml"]}`
### Playbook summary
Here are all steps in a single code block
```
# Usage: ansible-playbook -v list.yaml
- name: "List manipulation"
  hosts: localhost
  gather_facts: false
  tasks:
  - name: Initialize an empty list
    set_fact:
      list: []
  - name: Append element to list
    set_fact:
      list: "{{ list + [ 'element_1' ] }}"
  - name: Get list of files in current directory
    shell: "ls"
    register: ls_files
  - name: Append filtered elements (only yaml file) to list
    set_fact:
      list: "{{ list + [ item ] }}"
    loop: "{{ ls_files.stdout_lines }}"
    when: "'yaml' in item"
  - name: Remove element from list
    set_fact:
      list: "{{ list | difference([ 'element_1' ]) }}"
```
## Dictionary
### Initialization of a dictionary
```
  - name: Initialize an empty dictionary
    set_fact:
      dict: {}
```
Result is: `{"dict": {}},`
,
### Append element to a dictionary
```
  - name: Append element to dictionary
    set_fact:
      dict: "{{ dict | combine( { 'key_name': 'some_value' } ) }}"
```
Result is: `{"dict": {"key_name": "some_value"}}`
### Append multiple elements to a dictionary
```
  - name: Get list of files and their size in current directory
    shell: "ls -lh | awk '{print $5,$NF}'"
    register: ls_files_size
  - name: Append filtered elements (only yaml file) to list and their corresponding size
    set_fact:
      dict: "{{ dict | combine( { item.split()[1]: item.split()[0] } ) }}"
    loop: "{{ ls_files_size.stdout_lines }}"
    when: "'yaml' in item"
```
Result is: ` {"dict": {"key_name": "some_value", "dict.yaml": "1.6K"}}` if your current directory is for instance composed of:
- test.yml
- dict.yaml
- roles/
### Remove element from dictionary
```
  - name: Remove element from dictionary
    set_fact:
      dict: "{{ dict | ansible.utils.remove_keys('key_name')  }}"
```
Result is: ` {"dict": {"dict.yaml": "1.6K"}}`
 
### Playbook summary
Here are all steps in a single code block
```
# Usage: ansible-playbook -v dict.yaml
- name: "Dictionary manipulation"
  hosts: localhost
  gather_facts: false
  tasks:
  - name: Initialize an empty dictionary
    set_fact:
      dict: {}
  - name: Append element to dictionary
    set_fact:
      dict: "{{ dict | combine( { 'key_name': 'some_value' } ) }}"
  - name: Get list of files and their size in current directory
    shell: "ls -lh | awk '{print $5,$NF}'"
    register: ls_files_size
  - name: Append filtered elements (only yaml file) to list and their corresponding size
    set_fact:
      dict: "{{ dict | combine( { item.split()[1]: item.split()[0] } ) }}"
    loop: "{{ ls_files_size.stdout_lines }}"
    when: "'yaml' in item"
  - name: Remove element from dictionary
    set_fact:
      dict: "{{ dict | ansible.utils.remove_keys('key_name')  }}"
```

## Sources
- https://docs.ansible.com/ansible/latest/playbook_guide/complex_data_manipulation.html
- https://www.redhat.com/sysadmin/ansible-lists-dictionaries-yaml
- https://docs.ansible.com/ansible/latest/collections/ansible/utils/remove_keys_filter.html


