$ErrorActionPreference = 'Stop'
Write-Host "MarketOS AI - local setup" -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 20+ is required.' }
$key = Read-Host 'Paste your OpenAI API key (input is hidden)'
if ([string]::IsNullOrWhiteSpace($key)) { throw 'No API key supplied.' }
@("OPENAI_API_KEY=$key", "OPENAI_MODEL=gpt-5.6") | Set-Content -Encoding utf8 .env.local
Write-Host 'Key saved locally to .env.local (gitignored).' -ForegroundColor Green
npm install
npm run dev
