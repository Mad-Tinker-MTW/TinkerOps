# TinkerOps housekeeping — remove regenerable build/cache artifacts.
# Safe to run anytime: only deletes dist\ and __pycache__ (rebuilt on demand by
# `bun run build` / next Python run). Never touches src, docs, Data, node_modules,
# Data\backups, or Data\ui-order.json.
#
# Usage:
#   pwsh -File scripts\clean.ps1            # delete the artifacts
#   pwsh -File scripts\clean.ps1 -WhatIf    # preview only, delete nothing

[CmdletBinding(SupportsShouldProcess = $true)]
param()

$ErrorActionPreference = 'Stop'

# Project root = parent of this scripts\ folder.
$root = Split-Path -Parent $PSScriptRoot

# Targets are relative to root. Add regenerable dirs here, nothing else.
$targets = @(
    'dist',
    'scripts\__pycache__'
)

$freedBytes = 0
$removed = 0

foreach ($rel in $targets) {
    $path = Join-Path $root $rel

    if (-not (Test-Path $path)) {
        Write-Host "skip   $rel (not present)" -ForegroundColor DarkGray
        continue
    }

    # Safety: never delete anything that resolves outside the project root.
    $full = (Resolve-Path $path).Path
    if (-not $full.StartsWith((Resolve-Path $root).Path, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-Warning "refuse $rel (resolves outside project root: $full)"
        continue
    }

    $size = (Get-ChildItem $full -Recurse -Force -File -ErrorAction SilentlyContinue |
             Measure-Object -Property Length -Sum).Sum
    if ($null -eq $size) { $size = 0 }

    if ($PSCmdlet.ShouldProcess($full, 'Remove-Item -Recurse -Force')) {
        Remove-Item $full -Recurse -Force
        $freedBytes += $size
        $removed++
        Write-Host ("removed {0} ({1:N0} KB)" -f $rel, ($size / 1KB)) -ForegroundColor Green
    }
}

if (-not $WhatIfPreference) {
    Write-Host ("`nDone. Removed {0} item(s), freed {1:N1} MB." -f $removed, ($freedBytes / 1MB)) -ForegroundColor Cyan
}
