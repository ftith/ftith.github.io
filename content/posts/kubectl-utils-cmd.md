+++
title = 'Kubectl Utils Cmd'
date = 2026-11-07T10:25:44+01:00
ShowReadingTime = true
tags = ['kubectl', 'kubernetes']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Resource management

```bash
# List common resources in the current namespace
kubectl get pods,services,deployments

# List a resource in every namespace
kubectl get pods --all-namespaces

# Show more details, including node and IP
kubectl get pods -o wide

# Get details and recent events for a resource
kubectl describe pod <pod>

# Create or update resources declared in a manifest
kubectl apply -f <manifest.yaml>

# Replace an existing resource with the manifest
kubectl replace -f <manifest.yaml>
kubectl get job cronjob-singlejob -o yaml | sed "s/backoffLimit: 6/backoffLimit: 6\n  ttlSecondsAfterFinished: 5/g" | kubectl replace -f -

# Preview the changes a manifest would make
kubectl diff -f <manifest.yaml>

# Delete a resource declared in a manifest
kubectl delete -f <manifest.yaml>

# Watch a resource for changes
kubectl get pods --watch
watch kubectl get pods

# Delete all evicted pods
kubectl get po -A --field-selector 'status.phase!=Running' -o json | kubectl delete -f -

# Filter out jobs
kubectl get pods -o json --field-selector="status.phase!=Succeeded" 
kubectl get pods -l kind!=job

```
Notes: 
- Add `-n <namespace>` to namespaced commands to select a namespace. Use `-A` instead to list namespaced resources across all namespaces. 
- `kubectl get all` only returns a subset of resource types; it does not mean every resource in the cluster.
- `kubectl replace` updates an existing resource from the manifest and fails if the resource does not exist; use `kubectl apply` for the usual create-or-update workflow.

### Deployments

```bash
# Check deployment status
kubectl get deployments

# Update an image
kubectl set image deployment/<deployment> <container>=<image>:<tag>

# Watch a rollout complete
kubectl rollout status deployment/<deployment>

# View rollout history or undo the latest rollout
kubectl rollout history deployment/<deployment>
kubectl rollout undo deployment/<deployment>

# Scale a deployment
kubectl scale deployment/<deployment> --replicas=<count>
```

## Cluster management

```bash
# List nodes and their status
kubectl get nodes -o wide

# Inspect a node
kubectl describe node <node>

# Add a taint that prevents pods without a matching toleration from scheduling
kubectl taint nodes <node> <key>=<value>:NoSchedule

# Remove a taint by its key
kubectl taint nodes <node> <key>-

# Mark a node unschedulable for maintenance
kubectl cordon <node>

# Evict eligible pods and prepare a node for maintenance
kubectl drain <node> --ignore-daemonsets

# Allow new pods to be scheduled on the node again
kubectl uncordon <node>

# List namespaces
kubectl get namespaces

# List available API resource types
kubectl api-resources

# Show cluster endpoints and control-plane information
kubectl cluster-info

# Check whether the current identity can perform an action
kubectl auth can-i <verb> <resource> -n <namespace>
```

Taints repel pods that do not have a matching toleration. Common effects are `NoSchedule`, `PreferNoSchedule`, and `NoExecute`; inspect a node's taints with `kubectl describe node <node>`.

## Client context

```bash
# Show client and server versions
kubectl version

# Show only the kubectl client version
kubectl version --client

# Show the active context
kubectl config current-context

# List configured contexts
kubectl config get-contexts

# Switch the active context
kubectl config use-context <context>

# Set the default namespace for the active context
kubectl config set-context --current --namespace=<namespace>

# Show merged kubeconfig settings
kubectl config view
```

- `cordon` prevents new pods from being scheduled on a node but does not evict existing pods. 
- `drain` evicts eligible pods; it can be blocked by PodDisruptionBudgets or pods that cannot be evicted. After maintenance, use `uncordon` to make the node schedulable again.

## Troubleshoot and debug

```bash
# View recent events, sorted by time
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl get events --sort-by='{.lastTimestamp}'

# Read a pod's logs
kubectl logs <pod>

# Follow logs, or select a container in a multi-container pod
kubectl logs --follow <pod>
kubectl logs <pod> -c <container>

# Read logs from the previous container instance
kubectl logs <pod> --previous

# Run a command in a container
kubectl exec -it <pod> -- <command>

# Forward a local port to a pod
kubectl port-forward pod/<pod> <local-port>:<pod-port>

# Inspect the schema and fields for a resource
kubectl explain pod.spec

# Show resource details as YAML or JSON
kubectl get pod <pod> -o yaml
kubectl get pod <pod> -o json
```