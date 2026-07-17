# Registers the Windows Task Scheduler job that auto-pushes the synced
# extraction core (js/pi-module.js) to GitHub Pages after the daily retrain.
#
# Triggers:
#   - at logon + 30 min (the retrain eval runs at logon + 1 min, capped at 15)
#   - daily at 12:00 as a catch-up (StartWhenAvailable fires missed runs)
#
# To remove: Unregister-ScheduledTask -TaskName 'TrelloPowerUp_CorePush' -Confirm:$false

$scriptPath = Join-Path $PSScriptRoot "auto_push_core.ps1"

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

$logonTrigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$logonTrigger.Delay = "PT30M"
$dailyTrigger = New-ScheduledTaskTrigger -Daily -At 12:00

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries `
    -AllowStartIfOnBatteries

Register-ScheduledTask `
    -TaskName "TrelloPowerUp_CorePush" `
    -Action $action `
    -Trigger $logonTrigger, $dailyTrigger `
    -Settings $settings `
    -Description "Commits & pushes Trello Power-Up js/pi-module.js when the daily PDF Merge retrain updated it. Log: logs\auto_push.log" `
    -Force | Out-Null

Write-Host "Task 'TrelloPowerUp_CorePush' registered (logon +30min, daily 12:00)."
