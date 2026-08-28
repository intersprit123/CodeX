# MarketOS AI — Local Setup

MarketOS is designed so each installation can use its own API credentials. **Never commit credentials.**

## Windows quick start

1. Install Node.js 20+.
2. Clone/download this repository.
3. Open PowerShell in the project folder.
4. Run `./setup-local.ps1`.
5. When prompted, paste your OpenAI API key. The prompt is hidden.
6. The script writes the key to `.env.local`, which is ignored by Git.
7. The app starts locally.

## Why local keys?

A public website must never expose a shared OpenAI API key to browsers. In the local model, every user supplies their own key and pays their own API usage. This is appropriate for an open-source/developer build.

For a hosted consumer version, use a server-side secret and authentication/rate limits instead.

## Market data

Live exchange data is intentionally not bundled with the repository. Add licensed provider credentials locally when the provider adapter is enabled.
