# auto_push_core.ps1 — commit & push js/pi-module.js when the daily retrain
# (PDF Merge Tool eval task -> sync_core_to_html.mjs) has updated it.
# Runs from Task Scheduler (TrelloPowerUp_CorePush); safe to run repeatedly —
# it exits quietly when nothing changed and only ever commits pi-module.js.
# Log: logs\auto_push.log (gitignored)

$repo = $PSScriptRoot
$logDir = Join-Path $repo "logs"
New-Item -ItemType Directory -Force $logDir | Out-Null
$log = Join-Path $logDir "auto_push.log"
function Write-Log($m) { "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m" | Add-Content $log }

Set-Location $repo
$changed = git status --porcelain -- js/pi-module.js
if (-not $changed) { Write-Log "no changes to js/pi-module.js"; exit 0 }

git add js/pi-module.js
git commit -m "Auto-sync extraction core from daily retrain" --only js/pi-module.js 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Log "COMMIT FAILED"; exit 1 }

$out = git push 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Log "pushed updated pi-module.js ($(git rev-parse --short HEAD))"
} else {
    Write-Log "PUSH FAILED: $($out.Trim())"
    exit 1
}
