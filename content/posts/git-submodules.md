+++
title = 'Git Submodules'
date = 2025-10-25T18:58:31+02:00
tags = ['git', 'submodule']
ShowReadingTime = true
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++

## Clone parent project with submodules
```
# Pull directly submodules on parent clone
git clone --recurse-submodules https://github.com/ftith/ftith.github.io.git

# Pull submodules after the parent was already cloned
git submodule update --init --recursive
```

## Add/Create submodule
```
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```
results to in your `.gitmodules`:
```
[submodule "themes/PaperMod"]
	path = themes/PaperMod
	url = https://github.com/adityatelange/hugo-PaperMod.git
```
You can also use **relative** path for submodule to inherit its parent's connection method (ssh or https).

If you change directly the `.gitmodules` files, you need to run
```
git submodule sync 
```


## Update submodules
### Update all submodules
```
# Update the local submodule to detached HEAD (if you were working on local branch, you can just switch back to it)
$ git submodule update 

# Pull changes from remotes (if working on branch instead of detached HEAD)
$ git submodule update --remote

# Udpate your current local submodules' branch with remote changes and rebase/merge your local changes on top of it
$ git submodule update --remote --rebase/--merge
```

### Update one submodule
```
git submodule update --rebase --remote -- <submodule_path>
# e.g.
git submodule update --rebase --remote -- themes/PaperMod
```
Track other submodule branch instead of HEAD
git config -f .gitmodules submodule.DbConnector.branch stable


## Working on submodules
### Push submodule changes
```
# (from submodule path)
cd <submodule_folder>
git checkout <branch_name>
git add -u
git commit -m "chg in submodule"

# (from main repo)
cd ..
git add -u 
git commit -m "bump submodule"
git push --recurse-submodules=on-demand
```

## Check current submodules commit
At least 3 different ways to check the current commit on which your submodules are:
```sh
$ git submodule status
+b288ede80cbd70151e2f07f2e09ad6258e64f7fa themes/PaperMod (v8.0~70)

$ git ls-tree HEAD themes/PaperMod 
160000 commit 72615b6d49ab8b102e92e2e487ab420f41ba9223  themes/PaperMod

$ git diff themes/PaperMod
diff --git a/themes/PaperMod b/themes/PaperMod
index 72615b6..b288ede 160000
--- a/themes/PaperMod
+++ b/themes/PaperMod
@@ -1 +1 @@
-Subproject commit 72615b6d49ab8b102e92e2e487ab420f41ba9223
+Subproject commit b288ede80cbd70151e2f07f2e09ad6258e64f7fa
```

## Sources

- https://git-scm.com/book/en/v2/Git-Tools-Submodules
- https://www.damirscorner.com/blog/posts/20210423-ChangingUrlsOfGitSubmodules.html