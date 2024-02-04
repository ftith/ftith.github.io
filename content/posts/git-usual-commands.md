+++
title = 'Git Usual Commands'
date = 2024-02-04T11:34:09+01:00
ShowReadingTime = true
tags = ['git']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++
This page describe the usual git commands I used on daily, weekly or monthly basis.  

## Daily push

```
git add -u
git commit -m "<changes description>"
git push [<remote>] [<branch>]
```
e.g.
```
git add -u
git commit -m "add feature"
git push origin main
```

## Update feature branch from base branch
Scenario: you are working on your feature branch 'dev' and made a Pull Request targeting 'main' as base. Unfortunately, someone pushed changes on the base branch 'main' and your feature branch 'dev' is "Out-Of-Date". 

By default, the UI of github (or gitea) give you 2 strategies to sync your feature branch: "merge" or "rebase".

**⚠ Never use UI to handle conflict when your feature branch is out-of-date** 

### using merge (advised on base branch)
➕No force push needed so advised for "common" branches such as main or master

➖Useless merge commits which make review harder

[//]: <> (images are in static folder)
![gitea_base_merge.png](/img/posts/git/base_merge.png)
```
git fetch
git merge --no-ff origin/main
git push origin dev
```

### using rebase (advised on feature branch)
➕Clean history 

➖Need force push
Use `--rebase` to avoid any unnecessary merge commits. 

![gitea_base_rebase.png](/img/posts/git/base_rebase.png)
```
git pull --rebase origin main
git push --force-with-lease origin dev
```


## Revert local changes 
The following commands can be used when your changes have not been pushed to remote yet.
### Rollback file
```
## Revert to a branch head
git checkout <remote>/<branch> <filename>
# e.g.
git checkout origin/main README.md

## Revert to a given commit
git checkout <hash> <filename>
# e.g.
git checkout 072300df18a94f18077ca20a14224b5d99fee872 README.md
```
### Undo last commit (not pushed) without loss
```
git reset --soft HEAD~1
```

## "Rewrite" history
### Change a single commit (`--fixup` option)
```
git add -u
git log --oneline -3
git commit --fixup c53146d
git rebase -i --autosquash HEAD~3
git push --force-with-lease
```

### Reorder commits
```
git rebase -i HEAD~5
# use command ':m+' to move up line 
# use command ':m-2' to move down line
# use command ':wq'
git push --force-with-lease
```

### Rebase interactive
```
git rebase -i HEAD~5
+ set 'edit' to commit
+ edit in files
git add -u 
git rebase --continue
git push --force-with-lease
```

### Cancel/Undo a force push
1. Find the hash commit before your force push
You can get it either
- via the UI in github (or gitea)
- either in the log of your force push
```
git push --force-with-lease
[...]
555d43d...b1f1ca4 dev -> dev (forced update)
[...]
```
- either from the reflog
```
git reflog refs/remotes/origin/dev
b1f1ca4 (HEAD -> dev, origin/dev) refs/remotes/origin/dev@{0}: update by push
555d43d refs/remotes/origin/dev@{1}: update by push
```
2. Reset branch using the old hash commit
```
git reset --hard 555d43d
git push --force
```

## Source
- https://www.jvt.me/posts/2021/10/23/undo-force-push/
