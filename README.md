# MarketOS AI 🌍📈

**Open-source market intelligence workspace with an AI research copilot.**

MarketOS brings global markets, stocks, watchlists, portfolios, screening, news, alerts and AI research into one clean workspace.

> **Current status: public demo / MVP.** Market data and news are intentionally demo-only until the live providers are activated.

## ✨ What is already here

- Global market dashboard
- Global markets view
- Stock detail pages
- Interactive watchlist
- Demo portfolio workspace
- Stock screener with filters
- News categories
- Market alerts UI
- AI research lab
- MarketOS AI chat
- Explicit demo/live data architecture
- Modular provider interface

## 🔐 Security model

**Never commit API keys.**

For local use, keep secrets in `.env.local` or your deployment provider's secret manager:

```env
OPENAI_API_KEY=your_key_here
MARKET_DATA_MODE=demo
```

The public app contains no master OpenAI key. Each local installation can use its own key.

## 🧠 AI

MarketOS AI uses the OpenAI Responses API through a server-side route. The model is selected with `OPENAI_MODEL`; the default is `gpt-5.6-luna` for cost-sensitive usage. OpenAI remains the intelligence layer; market facts should come from authorized data providers.

## 📊 Live data — intentionally OFF

The project has a provider abstraction so a licensed quote/news provider can be added later without rewriting the UI. Until then `MARKET_DATA_MODE=demo` keeps the product deterministic and safe for public development.

## 🚀 Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Roadmap

1. Production validation and accessibility polish
2. Licensed real-time/historical market provider
3. News provider
4. PostgreSQL persistence
5. Authentication and user accounts
6. AI tool calling against grounded market data
7. Alerts delivery
8. Public hosted demo
9. Community contributions

## Disclaimer

MarketOS is a software/research tool. Demo figures are fictional. AI output is informational and is not personalized financial advice or a promise of returns.

## License

Open-source project. Add your preferred license before accepting external contributions.
