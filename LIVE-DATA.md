# Live market data — intentionally inactive

MarketOS currently runs in **demo mode**. No live market provider is connected or activated.

The provider interface is ready in `lib/market-provider.ts` and the mode is controlled by `MARKET_DATA_MODE`.

When we are ready to go live:

1. Choose a licensed/authorized market-data provider.
2. Add its credentials only as deployment/local secrets.
3. Implement its adapter behind `MarketProvider`.
4. Test quotes, timestamps, currencies, market status, errors, rate limits, and licensing requirements.
5. Explicitly switch `MARKET_DATA_MODE=live` only after testing.

Do not put provider credentials in GitHub or client-side code.
