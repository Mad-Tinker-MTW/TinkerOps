# TinkerOps autostart helper — launched by the "TinkerOps Dev Console" logon task.
# Starts the Vite dev server hidden on port 5175 so the dashboard (and the card
# launch endpoint, which only exists under `bun run dev`) is available at boot.
# Does NOT open a browser; navigate to http://localhost:5175/ or use the folder
# launcher. Idempotent: exits quietly if 5175 is already bound.

$ErrorActionPreference = 'SilentlyContinue'
$port = 5175
$root = Split-Path -Parent $PSScriptRoot   # project root (parent of scripts\)
$bun  = 'C:\Users\MadTi\scoop\shims\bun.exe'

# Already running? Do nothing.
$inUse = Get-NetTCPConnection -LocalPort $port -State Listen
if ($inUse) { exit 0 }

Set-Location $root
Start-Process -FilePath $bun -ArgumentList 'run','dev' -WorkingDirectory $root -WindowStyle Hidden
