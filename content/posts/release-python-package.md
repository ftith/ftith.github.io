+++
title = 'Build and release python package with uv and GitHub Actions workflows'
date = 2025-07-22T14:55:08+01:00
ShowReadingTime = true
tags = ['git', 'github actions', 'uv', 'python']
[editPost]
URL = "https://github.com/ftith/ftith.github.io/edit/main/content"
Text = "Suggest Changes"
appendFilePath = true
+++
## Tag and release python package with uv and GitHub Actions workflows
The goal of this article is to build and release python package using [uv](https://docs.astral.sh/uv/guides/package/) (for building and publishing) and [github actions](https://docs.github.com/en/actions/get-started/understanding-github-actions) (for automation).

### Build and publish
```
name: Package
on:
  push:
    tags:
      - "v*.*.*"
  workflow_dispatch:

jobs:
  build:
    name: "Build and publish package"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # for git-versionning
      - name: Install the latest version of uv
        uses: astral-sh/setup-uv@v6
        with:
          enable-cache: true
      - name: Build dist
        run: uv build
      - name: Publish packages
        run: uv publish --token ${{ secrets.TWINE_PASSWORD }}
```

### [Optional] Deploy to server
```
jobs:
  deploy:
    needs:
      - build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to the server
        uses: https://github.com/appleboy/ssh-action@master
        with:
          host: ${{ vars.HOST_MACHINE }}
          username: ${{ secrets.HOST_SSH_USER }}
          key: ${{ secrets.HOST_SSH_KEY }}
          script: |
            pip install --force-reinstall <package>
```

### [Optional] Custom PyPI Package Registry
If you are using custom PyPI Package Registry/Index (such as [gitea](https://docs.gitea.com/usage/packages/pypi)), you can use [`uv.index`](https://docs.astral.sh/uv/guides/package/#publishing-your-package) entry in `pyproject.toml`:
```
[[tool.uv.index]]
name = "gitea"
url = "https://pypi.example.com/simple/"
publish-url = "https://gitea.example.com/api/packages/{owner}/pypi"
explicit = true
```
and then build with the following command by adding `--index gitea`:
```
uv --native-tls publish --index gitea --token ${{ secrets.TWINE_PASSWORD }}
```

### [Optional] Fine-tune versioning
Using [semver](https://semver.org/) specification, you can fine-tune your release version. 

#### - Static versioning
In `pyproject.toml` the version is statically defined as follow:
```
[project]
name = "your-project"
version = "0.1.0"
```
You can then get your version using those two commands:
```
$ uv version
your-project 0.1.0
# OR
$ uvx --from=toml-cli --native-tls toml get --toml-path=pyproject.toml project.version
0.1.0
```
You can bump version using `uv version --bump minor` for instance:
```
uv version --bump minor
Resolved 30 packages in 187ms
Audited 28 packages in 0.71ms
your-project 0.1.0 => 0.2.0
```
and pushing your updated `pyproject.toml`.

#### - Dynamic versioning
In `pyproject.toml` add: 
```
[project]
name = "your-project"
dynamic = ["version"]  # Remove static version and add this line

[build-system]
requires = ["hatchling", "uv-dynamic-versioning"]
build-backend = "hatchling.build"

[tool.hatch.version]
source = "uv-dynamic-versioning" # specify a version Source 

[tool.uv-dynamic-versioning]
fallback-version = "0.1.0" # (optional)
```
You can bump version by creating a git **tag** and the built package version will be based on git tag:
```
$ git tag v0.2.0
$ uv build
Building source distribution...
Building wheel from source distribution...
Successfully built dist\your_project-0.2.0-py3-none-any.whl
```


## Sources
- https://semver.org/
- https://docs.astral.sh/uv/guides/package/
- https://github.com/astral-sh/uv/issues/6298
- https://www.thisdot.co/blog/tag-and-release-your-project-with-github-actions-workflows
- https://pydevtools.com/handbook/how-to/how-to-add-dynamic-versioning-to-uv-projects/
  
