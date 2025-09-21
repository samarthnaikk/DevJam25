# Run Next.js in production mode
$env:NODE_ENV = "production"
Write-Host "NODE_ENV set to: $env:NODE_ENV"
Write-Host "Starting Next.js in production mode..."
npx next start
