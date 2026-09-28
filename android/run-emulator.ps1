param(
    [string]$AndroidSdk,
    [string]$AvdName = 'x64_33',
    [string]$AvdHome,
    [string]$ApkPath,
    [int]$BootTimeoutSeconds = 300,
    [switch]$Headless
)

$ErrorActionPreference = 'Stop'

if (-not $AndroidSdk) {
    if ($env:ANDROID_HOME) { $AndroidSdk = $env:ANDROID_HOME }
    elseif ($env:ANDROID_SDK_ROOT) { $AndroidSdk = $env:ANDROID_SDK_ROOT }
    else { $AndroidSdk = 'D:\Android\Sdk' }
}
if (-not $AvdHome) { $AvdHome = Join-Path $env:USERPROFILE '.android\avd' }
if (-not $ApkPath) { $ApkPath = Join-Path $PSScriptRoot 'dist\yunxu-client-1.0.0.apk' }
if ($BootTimeoutSeconds -lt 30) { throw 'BootTimeoutSeconds must be at least 30.' }

$emulator = Join-Path $AndroidSdk 'emulator\emulator.exe'
$adb = Join-Path $AndroidSdk 'platform-tools\adb.exe'
foreach ($path in @($emulator, $adb, $ApkPath, (Join-Path $AvdHome "$AvdName.ini"))) {
    if (-not (Test-Path -LiteralPath $path)) { throw "Required file not found: $path" }
}

# This machine's emulator does not discover AVDs without an explicit AVD home.
$env:ANDROID_AVD_HOME = (Resolve-Path -LiteralPath $AvdHome).Path
$env:ANDROID_SDK_ROOT = (Resolve-Path -LiteralPath $AndroidSdk).Path

function Get-RunningAvdSerial {
    $deviceLines = & $adb devices
    if ($LASTEXITCODE -ne 0) { throw 'adb devices failed.' }
    foreach ($line in $deviceLines) {
        if ($line -notmatch '^(emulator-\d+)\s+device(?:\s|$)') { continue }
        $serial = $Matches[1]
        $name = (& $adb -s $serial shell getprop ro.boot.qemu.avd_name) -join ''
        if ($LASTEXITCODE -eq 0 -and $name.Trim() -eq $AvdName) { return $serial }
    }
    return $null
}

$serial = Get-RunningAvdSerial
if ($serial) {
    Write-Host "Reusing running AVD $AvdName ($serial)."
} else {
    $args = @('-avd', $AvdName, '-no-snapshot-load', '-no-snapshot-save', '-no-audio', '-no-boot-anim', '-gpu', 'software')
    if ($Headless) { $args += '-no-window' }
    $logDir = Join-Path $PSScriptRoot 'build'
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    $stdoutLog = Join-Path $logDir 'emulator.stdout.log'
    $stderrLog = Join-Path $logDir 'emulator.stderr.log'
    Write-Host "Starting AVD $AvdName. Emulator logs: $stdoutLog and $stderrLog"
    $windowStyle = if ($Headless) { 'Hidden' } else { 'Normal' }
    Start-Process -FilePath $emulator -ArgumentList $args -WorkingDirectory $AndroidSdk `
        -WindowStyle $windowStyle -RedirectStandardOutput $stdoutLog `
        -RedirectStandardError $stderrLog | Out-Null
}

$deadline = (Get-Date).AddSeconds($BootTimeoutSeconds)
while ((Get-Date) -lt $deadline) {
    if (-not $serial) { $serial = Get-RunningAvdSerial }
    if ($serial) {
        $booted = (& $adb -s $serial shell getprop sys.boot_completed) -join ''
        if ($LASTEXITCODE -eq 0 -and $booted.Trim() -eq '1') { break }
    }
    Start-Sleep -Seconds 2
}
if (-not $serial) {
    throw "AVD $AvdName did not appear in adb within $BootTimeoutSeconds seconds. Check android/build/emulator.stdout.log and emulator.stderr.log."
}
$booted = (& $adb -s $serial shell getprop sys.boot_completed) -join ''
if ($LASTEXITCODE -ne 0 -or $booted.Trim() -ne '1') {
    throw "AVD $AvdName ($serial) did not finish booting within $BootTimeoutSeconds seconds. Check android/build/emulator.stdout.log and emulator.stderr.log."
}

Write-Host "Android boot complete on $serial. Installing $ApkPath"
& $adb -s $serial install -r $ApkPath
if ($LASTEXITCODE -ne 0) { throw "APK installation failed on $serial." }
& $adb -s $serial shell am start -n 'com.yunxu.client/.MainActivity'
if ($LASTEXITCODE -ne 0) { throw "Could not launch com.yunxu.client/.MainActivity on $serial." }
Write-Host "Client opened on $serial. For a locally running backend, use http://10.0.2.2:8100 in the app."
