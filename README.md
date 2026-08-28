# MarketOS AI

AI-powered global market intelligence platform.

## Vision

MarketOS AI brings global markets, shares, portfolio intelligence, screening, news, alerts, and AI research into one workspace.

## Principles

- Market data comes from licensed/authorized data providers, not from the language model.
- OpenAI provides the intelligence/orchestration layer.
- API keys and provider secrets stay in environment variables and secret stores.
- AI outputs are informational and evidence-backed; the product does not promise returns.
- Provider integrations are modular so data vendors can be changed without rewriting the product.

## Initial modules

- Global market dashboard
- Stock/asset search
- Asset detail pages
- Watchlists
- Portfolio tracking
- Market screener
- News intelligence
- AI market research
- Alerts
- Fundamental and technical analytics

## Planned architecture

Next.js/TypeScript frontend + Python/FastAPI backend + PostgreSQL/Timescale-style time-series storage + Redis + OpenAI agent orchestration + modular market-data providers.

## Development

Never commit `.env` files or API keys. Configure `OPENAI_API_KEY` in the local/runtime environment.
