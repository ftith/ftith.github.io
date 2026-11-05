# Personal github page
## Theme
Pull PaperMod theme submodule after existing clone (https://github.com/adityatelange/hugo-PaperMod/wiki/Installation)
```
# Install
git submodule update --init --recursive

# Bump
git submodule update --remote --merge
```
On theme change: 
1. Checkout submodule
2. Update hugo.toml to reference the new theme
3. Copy layouts from the new theme to readd mermaid extension
## Local commands
```
# Start server locally
hugo server -D

# Create content from a custom archetype
hugo new content --kind <archetype_name> <subfolder>/<post_name>.md
hugo new content --kind post posts/git-usual-commands.md -f
hugo new content --kind jcard jcards/positions.md
```