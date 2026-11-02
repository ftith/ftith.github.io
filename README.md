# Personal github page
## Theme
Pull PaperMod theme submodule after existing clone (https://github.com/adityatelange/hugo-PaperMod/wiki/Installation)
```
# Install
git submodule update --init --recursive

# Bump
git submodule update --remote --merge
```
## Local commands
```
# Start server locally
hugo server -D

# Create content from a custom archetype
hugo new content --kind <archetype_name> <subfolder>/<post_name>.md
hugo new content --kind post posts/git-usual-commands.md -f
```