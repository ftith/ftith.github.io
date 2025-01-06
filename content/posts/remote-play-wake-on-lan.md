+++
title = 'Play steam games remotely using moonlight/sunshine or steam link and wake-on-lan'
date = 2024-07-28T12:29:43+02:00
tags = ['steam', 'remote', 'steamlink', 'wake-on-lan', 'wireguard']
ShowReadingTime = true
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++
## General overview

### Goal
My goal here is to be able to play on my PC remotely from a portable device (laptop, tablet or phone) .

I used **steamlink** first to play through the Internet. It worked well and did not need to have additional setup (no vpn or additional port in/out manual setup on my computer or router). 

I also want my computer to be able to go to sleep to save energy and be able to wake it up remotely. I needed a solution to send magic packet (**wake on lan**) _safely_ so **Wireguard VPN** comes in action.

### TeamViewer / ruskDesk / Remote Desktop / Moonlight feedbacks 
Unfortunately, on my last macOS update, steamlink kept crashing after the update. I had no other choice to give up and look up for another alternative. I've tried:
- Teamviewer:
  - advantage: simple and quick setup
  - drawbacks: 
    - Close source 
    - Issue in terms of performance for gaming
    - Major issue: no possiblity to self host
- **rustDesk**:
  - advantages: 
    - Opensource 
    - Self-host (I was able to use it with a VPN) AND through their servers
  - drawbacks: 
    - Setup using rustDesk servers is apparently not very good in terms of performance (not tested myself though)
    - Setup was a bit quirky for self-host setup (and I wanted it this way since it is more secure)
    - Major issue on gaming: https://github.com/rustdesk/rustdesk/issues/2525
- **Windows Remote Desktop**
  - advantage: Coming with Windows so no additional setup needed (if you have professional Windows)
  - drawbacks: 
    - RDP server only comes with Windows Professional. If you have a Home edition, you'll need to do additional setup to enable it.
    - Performance issues on gaming
    - WAN setup is not advised
- **Sunshine(server) / Moonlight(client)**
  - advantages: 
    - open-source
    - self-host
    - can work on LAN and WAN
    - client can be installed on mobile as well
  - drawbacks: 
    - Only works with Nvidia graphic cards


### Setup schema
**My steamlink setup:**
```mermaid
flowchart LR
    remote[remote device]-. ssh through wireguard .-> pi[raspberry pi]
    pi -- send magic packet if PC is in sleep mode --> pc
    steamlink -- play through internet --> steam

    subgraph remote
        steamlink
    end
    subgraph LAN
        pi
        pc
    end
    subgraph pc[windows PC]
        steam
    end

    style LAN fill:#f66
```

**My moonlight/sunshine setup:**
```mermaid
flowchart LR
    remote[remote device]-. ssh through wireguard .-> pi[raspberry pi]
    pi -- send magic packet if PC is in sleep mode --> pc
    moonlight -. play through wireguard vpn .-> sunshine 
    sunshine --> steam
    sunshine --> desktop

    subgraph remote
        moonlight
    end
    subgraph LAN
        pi
        pc
    end
    subgraph pc[windows PC]
        sunshine
        desktop
        steam
    end

    style LAN fill:#f66
```
## Installation steps
1. Create a dynDNS address (using for instance https://www.noip.com/) [[1]](#1-how-to-install-wireguard-on-raspberry-pi-using-pivpn-httpsraspberrytipscominstall-wireguard-raspberry-pi)
1. Setup your dynDNS on your router [[2]](#2-how-to-configure-dyndns-on-a-livebox-httpscommunauteorangefrt5trucs-et-astuceslivebox-comment-y-accc3a9der-depuis-internetta-p635954)
   1. Personally, I have a livebox so the setup is under `Configuration avancée > Réseau > DynDNS` ![dyndns.png](/img/posts/dyndns.png)
1. Install wireguard on your raspberry using piVPN [[1]](#1-how-to-install-wireguard-on-raspberry-pi-using-pivpn-httpsraspberrytipscominstall-wireguard-raspberry-pi)
1. Install wakeonlan command on raspberry pi [[3]](#3-how-to-send-a-magic-packet-httpswwwcybercitibiztipslinux-send-wake-on-lan-wol-magic-packetshtml)
    ```
    sudo apt install etherwake
    ```
1. On your host device,
   - enable `Remote Play` in your Steam settings
   - **OR** install sunshine
1. On your remote device,  
   1. install wireguard "client"
   1. install steamlink **OR** moonlight

## Play steps 
1. Connect to your wireguard VPN
1. (Optional) To run only if your PC is in sleep mode:
   1. SSH to your raspberry pi using wireguard IP 
   1. Send magic package to your PC from raspberry pi
    ```
    wakeonlan <PC mac address>
    ```
3. Start steamlink/moonlight on your client and connect to your PC

## Sources
- #### [1] How to install wireguard on raspberry pi using piVPN https://raspberrytips.com/install-wireguard-raspberry-pi/
- #### [2] How to configure dynDNS on a livebox https://communaute.orange.fr/t5/Trucs-et-astuces/Livebox-Comment-y-acc%C3%A9der-depuis-Internet/ta-p/635954
- #### [3] How to send a magic packet: https://www.cyberciti.biz/tips/linux-send-wake-on-lan-wol-magic-packets.html