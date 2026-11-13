# auto_push_core.ps1 — commit & push the Power-Up's generated files when their
# sources changed:
#   * js/pi-module.js — updated by the daily retrain
#     (PDF Merge Tool eval task -> sync_core_to_html.mjs)
#   * merge/          — regenerated here by deploy_merge.mjs from
#     PDF Merge Tool/PDF_merge_tool.html (+ tpl_data.js, open fonts only)
# Runs from Task Scheduler (TrelloPowerUp_CorePush); safe to run repeatedly —
# it exits quietly when nothing changed and only ever commits those paths.
# Run it by hand to publish a merge-tool change right away.
# Log: logs\auto_push.log (gitignored)

$repo = $PSScriptRoot
$logDir = Join-Path $repo "logs"
New-Item -ItemType Directory -Force $logDir | Out-Null
$log = Join-Path $logDir "auto_push.log"
function Write-Log($m) { "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m" | Add-Content $log }

Set-Location $repo

$deployOut = node (Join-Path $repo "deploy_merge.mjs") 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) { Write-Log "DEPLOY_MERGE FAILED: $($deployOut.Trim())" }

$paths = @("js/pi-module.js", "merge")
$changed = git status --porcelain -- $paths
if (-not $changed) { Write-Log "no changes to pi-module.js or merge/"; exit 0 }

git add -- $paths
git commit -m "Auto-sync from PDF Merge Tool (extraction core / merge page)" -- $paths 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Log "COMMIT FAILED"; exit 1 }

$out = git push 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Log "pushed $(($changed -split "`n").Count) changed path(s) ($(git rev-parse --short HEAD))"
} else {
    Write-Log "PUSH FAILED: $($out.Trim())"
    exit 1
}
