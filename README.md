# BotCMD

A Discord moderation and utility bot tailored for GTA/NoLimit servers. This repository contains the bot source, configuration examples and developer documentation to run and contribute.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- Auto role assignment on join
- Presence-based promo role assignment (custom status detection)
- Moderation commands (ban/kick/mute/clear)
- Utilities: giveaways, server stats, vote tracking

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create your config

```bash
cp config/config.example.js config/config.js
# Edit config/config.js and add your bot token and ids
```

3. Start the bot

```bash
node index.js
# or use PM2: pm2 start index.js --name BotCMD
```

4. (Optional) Enable presence debug logs

```bash
DEBUG_PRESENCE=1 node index.js
```

## Publishing to GitHub (safe steps)

1. Make sure `config/config.js` is not tracked. If it is, remove it from history or rotate secrets.

```bash
git rm --cached config/config.js || true
git add .gitignore config/config.example.js README.md
git commit -m "Prepare repo for publishing: add example config and README"
```

2. Create a GitHub repo and push:

```bash
# using GitHub CLI (recommended):
gh repo create vgtray/BotCMD --public --source=. --remote=origin
git branch -M main
git push -u origin main
```

If you accidentally pushed a token, **revoke it immediately** in the Discord Developer Portal and create a new one.

## Contributing

See `CONTRIBUTING.md` for contribution guidelines, code style and PR workflow.

## Troubleshooting

- If the bot can't add/remove roles: ensure the bot role is above the target role and it has the `Manage Roles` permission.
- If you see repeated presence events causing duplicate logs: enable `DEBUG_PRESENCE` to trace and file an issue with a screenshot.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
