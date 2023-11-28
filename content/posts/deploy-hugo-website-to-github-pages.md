+++
title = 'Deploy hugo website to Github Pages'
date = 2023-11-28T21:29:31+01:00
+++

Hey! My first post is a _dog eats dog_ post: I will give you the commands I used to deploy my blog using hugo framework to github pages.

Sources:
- [Quick start on official Hugo website](https://gohugo.io/getting-started/quick-start/)
- [Papermod Theme Installation](https://adityatelange.github.io/hugo-PaperMod/posts/papermod/papermod-installation)
## Prerequisites
## Local setup
### Create a new hugo website
This command will generate a template for hugo project. By default it will use .toml extension for the configuration file. You can also use .yaml extension by adding `--config hugo.yaml` to the first command.
```
# create a hugo template directory
hugo new site github_pages
cd github_pages

# initialize the folder as git repository
git init
```
### Add a theme
There multiple methods described in [Papermod Theme Installation](https://adityatelange.github.io/hugo-PaperMod/posts/papermod/papermod-installation)
but I would go with submodule method since it will be easier to handle the incoming future changes.
```
# add the theme as submodule
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive

# add theme name to hugo configuration file
echo "theme = 'PaperMod'" >> hugo.toml
```
### Start the server locally
```
hugo server -D
```
You can now see your website locally at [http://localhost:1313/](http://localhost:1313/)

### (Optional) Add a post
```
hugo new content posts/deploy-hugo-website-to-github-pages.md
```
## Github pages setup
Once you are satisfied with your local changes you can start to deploy to github pages. 

Source: [https://gohugo.io/hosting-and-deployment/hosting-on-github/](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
### Create the repository
Create a new repository on [github.com/new](https://github.com/new) with your username name and be sure that it is public (otherwise it won't be accessible on `https://<username>.github.io`).

Go the `settings/pages` of your github repository e.g. `https://github.com/<username>/<username>/settings/pages` and change the Source to GitHub Actions

Then on your local repository, run:
```
git remote add origin git@github.com:<username>/<username>.github.io.git
sed -i 's|example.org|<username>.github.io|g' hugo.toml
```


### Create the workflow
Locally, create a new file `.github/workflows/hugo.yaml` with the following content:
```
# Sample workflow for building and deploying a Hugo site to GitHub Pages
name: Deploy Hugo site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      - main

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

# Default to bash
defaults:
  run:
    shell: bash

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.120.2
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb          
      - name: Install Dart Sass
        run: sudo snap install dart-sass
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v3
      - name: Install Node.js dependencies
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"
      - name: Build with Hugo
        env:
          # For maximum backward compatibility with Hugo modules
          HUGO_ENVIRONMENT: production
          HUGO_ENV: production
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./public

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Push 
```
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin master
```
Wait for the completion of the build in the actions section of your github repository: `https://github.com/<username>/<username>.github.io/actions`.

You will then be able to access to your website at the following address: `https://<username>.github.io/`