# NanoFile CLI one-line installer: download nf.exe, place it in a per-user bin directory and register that directory on User PATH.
# Designed for `irm <url> | iex`; it is fully self-contained and never relies on $PSScriptRoot or script parameters.

$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$sourceUrl = "https://raw.githubusercontent.com/xiaode-ai/nanofile-connector/main/cli/nf.exe"
$installDir = Join-Path $env:LOCALAPPDATA "Programs\NanoFile\bin"
$exePath = Join-Path $installDir "nf.exe"
$aliasPath = Join-Path $installDir "nanofile-cli.exe"
$tempPath = "$exePath.download"

# nf.exe is a thin proxy, so warn (without blocking) when the desktop app alias is absent.
$desktopAlias = Join-Path $env:LOCALAPPDATA "Microsoft\WindowsApps\NanoFile.exe"
if (-not (Test-Path -LiteralPath $desktopAlias)) {
    Write-Warning "NanoFile desktop app was not detected. Install it first: https://apps.microsoft.com/detail/9PGWD50GWCJW"
}

New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Write-Host "[1/4] Downloading nf.exe ..." -ForegroundColor Cyan
Invoke-WebRequest -UseBasicParsing -Uri $sourceUrl -OutFile $tempPath

# Reject truncated or non-PE payloads before replacing an existing installation.
$payload = [System.IO.File]::ReadAllBytes($tempPath)
if ($payload.Length -lt 100000 -or $payload[0] -ne 0x4D -or $payload[1] -ne 0x5A) {
    Remove-Item -LiteralPath $tempPath -Force
    $ErrorActionPreference = $previousErrorActionPreference
    throw "Downloaded payload is not a valid Windows executable."
}
Move-Item -LiteralPath $tempPath -Destination $exePath -Force
Copy-Item -LiteralPath $exePath -Destination $aliasPath -Force

# Prepend the bin directory on User PATH so a fresh nf.exe wins over any stale copy already on PATH.
Write-Host "[2/4] Registering $installDir on User PATH ..." -ForegroundColor Cyan
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($null -eq $userPath) { $userPath = "" }
$entries = @($userPath.Split(";") | Where-Object { $_ -and ($_ -ne $installDir) })
[Environment]::SetEnvironmentVariable("PATH", ((@($installDir) + $entries) -join ";"), "User")
$env:PATH = "$installDir;$env:PATH"

# Verify through the real binary; a missing desktop client is reported separately from a broken download.
Write-Host "[3/4] Verifying ..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
$versionOutput = (& $exePath version 2>&1 | Out-String).Trim()
$ErrorActionPreference = $previousErrorActionPreference
if ($versionOutput -match "NanoFile CLI v") {
    Write-Host "[4/4] Installed: $versionOutput" -ForegroundColor Green
} elseif ($versionOutput -match "not installed") {
    Write-Warning "nf.exe is installed, but the desktop client was not found. Install NanoFile, then run: nf version"
} else {
    Write-Warning "Verification returned: $versionOutput"
}

Write-Host ""
Write-Host "Open a NEW terminal window, then run: nf version" -ForegroundColor Yellow
Write-Host "To update nf later, run the same one-line install command again."
