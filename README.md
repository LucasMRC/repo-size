# 📦 Repo size - homemade

### How to use

1. Clone the repo.
2. Generate a Github classic token with `repo` permissions.
3. Create a `tk.txt` file in the `src/scripts` directory and paste the token (yes, it could have been the public directory, but it could also have been in the shut it!).
4. Build it and load as temporary extension in your Firefox based browser of choice.

### Considerations

Maybe I'll improve this, maybe I won't. For now, there's a basic Svelte and tailwind logic for adding a popup, and a background script to handle token storage.
I'll most likely get it to a state enough to publish it so that I don't have to add this every time I start my browser. 

### Shout-outs

Kudos to [@harshjv](https://github.com/harshjv) for his [github-repo-size](https://github.com/harshjv/github-repo-size), which served for inspiration to make this humble thing.
His addon is probably better than this, it's just that I'm going through a no-third-party phase.

The human-readable size function was shamelessly copied from [this stackoverflow answer](https://stackoverflow.com/a/14919494).
