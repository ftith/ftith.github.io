+++
title = 'Ansible Async Task'
date = 2023-12-20T22:06:08+01:00
draft = true
ShowReadingTime = true
tags = ['ansible', 'async', 'until', 'retry', 'asynchronous']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

By default Ansible runs tasks synchronously, but you might need 
```
- hosts: localhost
  gather_facts: false
  tasks:
  - name: Check if applications were deployed properly
    shell: "until cat log.txt | grep -q '{{item}} is deployed'; do  sleep 3; done"
    register: log_output
    async: 30
    poll: 0
    loop:
      - application1
      - application2
      - application3

  - name: Check sync status
    async_status:
      jid: "{{ async_result_item.ansible_job_id }}"
    loop: "{{ log_output.results }}"
    loop_control:
      loop_var: "async_result_item"
    register: async_poll_results
    until: async_poll_results.finished
    retries: 30
```

Source:
- https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_async.html