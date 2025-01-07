+++
title = 'Create prometheus alert for absent metrics'
date = 2025-01-03T11:42:06+01:00
ShowReadingTime = true
tags = ['prometheus','alert','grafana','promql']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

# Prerequisites
- `prometheus` package installed
- `prometheus-alertmanager` package installed
- `node-exporter` deployed on target device: this alert is using the [node-exporter](https://github.com/prometheus/node_exporter) in order to use `node_filesystem_avail_bytes` metrics.

# Create an Alerting Rule in Prometheus

### PromQL expression to detect missing mountpoints
Make sure to test your query on `/explore` tab. 

You can use metric `node_filesystem_avail_bytes` to detect specific mountpoint (e.g. `/mnt/data`) on specific instance (e.g `vm-name:9100`):
```
node_filesystem_avail_bytes{instance="vm-name:9100",mountpoint="/mnt/data"}
```
> ⚠ Any missing mountpoints for an instance might be due to default regexp value of the argument `--collector.filesystem.ignored-mount-points="^/(dev|proc|run|sys|mnt|media|var/lib/docker/.+)($|/)"`, so you might just remove the path you need in regexp value
If you need to detect missing metric, you can use vector `absent()`

> ⚠ vector `absent()` cannot be used for multiple instances promQL regexp (or at least not the way you are expected). 
> So instead of 
> ```
> absent(node_filesystem_avail_bytes{instance~="vm-name:9100|vm-name2:9100",mountpoint="/mnt/data"})
> ```
> you'll need to use `or` operator
> ```
> absent(node_filesystem_avail_bytes{instance="vm-name:9100",mountpoint="/mnt/data"}) or absent(node_filesystem_avail_bytes{instance="vm-name2:9100",mountpoint="/mnt/data"})
> ```

### Alert rule
When your expression is ready, you can define an alert rule in a new file e.g. `/etc/prometheus/alert_rules.yml`:
```
groups:
  - name: filesystem_alerts
    rules:
      - alert: MountPointMissing
        expr: absent(node_filesystem_avail_bytes{instance="vm-name:9100",mountpoint="/mnt/data"})
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Mount point /mnt/data"
          description: "The mount point /mnt/data is not available on {{ $labels.instance }} for more than 5 minutes."
```

and reference it in your `prometheus.yml` configuration file
```
rule_files:
  - "alert_rules.yml"
```

# Setup a notification configuration in Alertmanager
Here is an exemple of an alert configuration to send a notification to slack:
```
global:
  slack_api_url: "<SLACK_WEBHOOK_URL>"
route:
  group_by: ['instance', 'alert']
  group_wait: 1m
  group_interval: 5m
  repeat_interval: 24h
  receiver: slack-notifications

receivers:
  - name: 'slack-notifications'
    slack_configs:
      # https://prometheus.io/docs/alerting/configuration/#slack_config
      - channel: '<slack_channel>'
        send_resolved: true
        icon_url: https://avatars3.githubusercontent.com/u/3380462
        title: "{{ .CommonAnnotations.summary }} is {{ if .Alerts.Firing }}DOWN{{ else }}OK{{ end }}"
        text: >-
            *Description*: {{ .CommonAnnotations.description }}
            
            {{ range .Alerts -}}
              {{ range .Labels.SortedPairs }} • *{{ .Name }}:* `{{ .Value }}`
              {{ end }}
            {{ end }}
```
`/etc/prometheus/alertmanager.yml`

# Restart Prometheus and Alertmanager 
```
systemctl restart prometheus
systemctl restart prometheus-alertmanager
```



# Sanity checks
1. To make sure that the syntax is correct you can run promtool on rule and on configuration file
    ```
    promtool check rules /etc/prometheus/alert_rules.yml
    promtool check config /etc/prometheus/prometheus.yml
    ```
1. You can also check its deployment in grafana,  in `Alerting > Alert rules` at URL `/alerting/list`.
