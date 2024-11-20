+++
title = 'Manage Windows Using Ansible'
date = 2024-11-20T12:25:12+01:00
ShowReadingTime = true
tags = ['ansible','windows']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Setup openssh (prerequisites)
Before using ansible to manage windows, make sure that openssh is installed and enabled. If not, you can use this powershell script to do so:
```
$sshServer = Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH.Server*'

if ($sshServer.State -ne 'Installed') {
    Write-Host "Installing OpenSSH Server..."
    Add-WindowsCapability -Online -Name $sshServer.Name
} else {
    Write-Host "OpenSSH Server is already installed."
}

# Set default shell to powershell for ansible
if (-not (Get-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -ErrorAction SilentlyContinue)) {
    Write-Host "Set default shell to powershell..."
    New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force
    New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShellCommandOption -Value "/c" -PropertyType String -Force
} else {
    Write-Host "Default shell already configured."
}

# Optional: Reconfigure the firewall to allow SSH traffic to port 2222 (default one is 22)
Write-Host "Configuring firewall to allow SSH traffic..."
Remove-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue
New-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -Description "Inbound rule for OpenSSH SSH Server (sshd)" -DisplayName "OpenSSH Server (sshd)" -Group "OpenSSH Server" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 2222

# Start the OpenSSH server service
Write-Host "Starting OpenSSH Server service..."
Restart-Service sshd

## Set the OpenSSH server service to start automatically on boot
Write-Host "Configuring OpenSSH Server service to start automatically..."
Set-Service -Name sshd -StartupType 'Automatic'

Write-Host "OpenSSH setup completed."
```

## Run one command
```
ansible -m win_shell -a "hostname" win_group
```

That's it! 

## Playbook exemples to update your windows hosts configuration
### Setup autologon
```
ansible-playbook setup_windows.yaml --tags=autologon
```

Playbook `setup_windows.yaml`:
```
- name: Setup aulogon
  hosts: win_group
  strategy: free
  gather_facts: false
  tags: autologon
  tasks:
  - ansible.windows.win_powershell:
      script: |
        [CmdletBinding()]
        param (
          [String]
          $RegistryPath,
          [String]
          $Domain,
          [String]
          $User,
          [String]
          $Pass
        )
        Set-ItemProperty $RegistryPath 'AutoAdminLogon' -Value "1" -Type String
        Set-ItemProperty $RegistryPath 'DefaultDomainName' -Value "$Domain" -Type String
        Set-ItemProperty $RegistryPath 'DefaultUsername' -Value "$User" -type String 
        Set-ItemProperty $RegistryPath 'DefaultPassword' -Value "$Pass" -type String
        Get-ItemProperty $RegistryPath
      parameters:
        RegistryPath: 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon'
        Domain: 'YOUR-DOMAIN'
        User: 'your_name'
        Pass: "your_password"
    register: autologon_postchange
  - debug:
      var: autologon_postchange
```
