# TinkerOps — MTW Workshop Dev Console
# Launch script for Windows (PowerShell)

Write-Host "⚙  TinkerOps starting..." -ForegroundColor Yellow

$port = 5175
$dir  = $PSScriptRoot

Set-Location $dir

# Check for node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    bun install
}

# Launch dev server
bun run dev
