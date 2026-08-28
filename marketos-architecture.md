# MarketOS AI — Architecture v0

## Product loop

Open dashboard → understand market pulse → discover asset → research with AI → save watchlist → configure alert → return when something changes.

## System boundaries

```text
Market data / news providers
          ↓
   Provider adapters
          ↓
 Normalized market layer
          ↓
 PostgreSQL + time-series data + Redis
          ↓
      Backend tools
          ↓
 OpenAI Market Agent / specialists
          ↓
       Web client
```

## Agent roles

- Market Agent: routes questions and summarizes broad market conditions.
- Stock Agent: analyzes an individual asset.
- Fundamental Agent: interprets financial statements and valuation data.
- Technical Agent: analyzes price/volume indicators.
- News Agent: summarizes relevant news and links it to affected assets.
- Macro Agent: interprets rates, inflation, currencies, commodities and macro releases.
- Portfolio Agent: explains holdings, exposures and performance.
- Screener Agent: converts natural-language criteria into structured filters.
- Research Agent: combines tool results into an evidence-backed report.
- Alert Agent: evaluates user-defined conditions.

## Data rules

The model must not invent live prices, fundamentals, news or corporate actions. Tools must return timestamped data with provider/source metadata. Responses should distinguish observed facts from model interpretation.

## First API surface

- `GET /health`
- `GET /markets/overview`
- `GET /assets/search?q=`
- `GET /assets/{symbol}`
- `GET /assets/{symbol}/chart`
- `POST /ai/research`
- `POST /screen`
- `GET /news`
- `POST /watchlists`
- `POST /alerts`

## Security

Never commit API keys. `OPENAI_API_KEY` belongs only in the runtime environment/secret manager. User portfolio data must be isolated per account.

## Regulatory/product boundary

MarketOS is an information and research product. It should avoid representing AI output as guaranteed investment advice or guaranteed returns. Any future personalized advisory or execution feature requires a dedicated compliance review for the target jurisdiction.
