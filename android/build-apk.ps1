param(
    [string]$AndroidSdk = $env:ANDROID_HOME
)

$ErrorActionPreference = 'Stop'
$project = $PSScriptRoot
if (-not $AndroidSdk) { $AndroidSdk = $env:ANDROID_SDK_ROOT }
if (-not $AndroidSdk) { throw 'Set ANDROID_HOME or pass -AndroidSdk with the Android SDK directory.' }
$buildTools = Join-Path $AndroidSdk 'build-tools\34.0.0'
$androidJar = Join-Path $AndroidSdk 'platforms\android-35\android.jar'
$aapt2 = Join-Path $buildTools 'aapt2.exe'
$aapt = Join-Path $buildTools 'aapt.exe'
$d8 = Join-Path $AndroidSdk 'cmdline-tools\latest\bin\d8.bat'
$zipalign = Join-Path $buildTools 'zipalign.exe'
$apksigner = Join-Path $buildTools 'apksigner.bat'
foreach ($path in @($androidJar, $aapt2, $aapt, $d8, $zipalign, $apksigner)) {
    if (-not (Test-Path -LiteralPath $path)) { throw "Android SDK component missing: $path" }
}

$build = Join-Path $project 'build-direct'
$compiled = Join-Path $build 'compiled'
$generated = Join-Path $build 'generated'
$classes = Join-Path $build 'classes'
$dex = Join-Path $build 'dex'
$dist = Join-Path $project 'dist'
$signing = Join-Path $project 'signing'
foreach ($dir in @($compiled, $generated, $classes, $dex, $dist, $signing)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

function Run-Checked([string]$exe, [string[]]$arguments) {
    & $exe @arguments
    if ($LASTEXITCODE -ne 0) { throw "Build tool failed: $exe (exit $LASTEXITCODE)" }
}

$res = Join-Path $project 'app\src\main\res'
$manifest = Join-Path $project 'app\src\main\AndroidManifest.xml'
$source = Join-Path $project 'app\src\main\java\com\yunxu\client\MainActivity.java'
$rSource = Join-Path $generated 'com\yunxu\client\R.java'
$unsigned = Join-Path $build 'unsigned.apk'
$aligned = Join-Path $build 'aligned.apk'
$output = Join-Path $dist 'yunxu-client-1.0.0.apk'

Run-Checked $aapt2 @('compile', '--dir', $res, '-o', $compiled)
$flats = @(Get-ChildItem -LiteralPath $compiled -Filter '*.flat' | ForEach-Object FullName)
if ($flats.Count -eq 0) { throw 'Android resources did not compile.' }
Run-Checked $aapt2 (@('link', '-o', $unsigned, '--manifest', $manifest, '-I', $androidJar, '--java', $generated, '--version-code', '1', '--version-name', '1.0.0') + $flats)
Run-Checked 'javac' @('-source', '8', '-target', '8', '-encoding', 'UTF-8', '-classpath', $androidJar, '-d', $classes, $source, $rSource)
$classJar = Join-Path $build 'classes.jar'
Run-Checked 'jar' @('cf', $classJar, '-C', $classes, '.')
Run-Checked $d8 @('--lib', $androidJar, '--output', $dex, $classJar)
Push-Location $dex
try { Run-Checked $aapt @('add', $unsigned, 'classes.dex') }
finally { Pop-Location }
Run-Checked $zipalign @('-f', '-p', '4', $unsigned, $aligned)

$key = Join-Path $signing 'yunxu-release.jks'
$passwordFile = Join-Path $signing 'password.txt'
if ((Test-Path -LiteralPath $key) -xor (Test-Path -LiteralPath $passwordFile)) {
    throw 'Signing key and password file must be kept together. Restore the missing signing file from backup.'
}
if (-not (Test-Path -LiteralPath $key)) {
    $password = [Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
    [System.IO.File]::WriteAllText($passwordFile, $password)
    $env:YX_APK_KEY_PASS = $password
    try {
        Run-Checked 'keytool' @('-genkeypair', '-keystore', $key, '-storepass:env', 'YX_APK_KEY_PASS', '-keypass:env', 'YX_APK_KEY_PASS', '-alias', 'yunxu', '-keyalg', 'RSA', '-keysize', '3072', '-validity', '10000', '-dname', 'CN=Yunxu Client, O=Yunxu, C=CN', '-noprompt')
    } finally { Remove-Item Env:YX_APK_KEY_PASS -ErrorAction SilentlyContinue }
}

$env:YX_APK_KEY_PASS = [System.IO.File]::ReadAllText($passwordFile).Trim()
try {
    Run-Checked $apksigner @('sign', '--ks', $key, '--ks-key-alias', 'yunxu', '--ks-pass', 'env:YX_APK_KEY_PASS', '--key-pass', 'env:YX_APK_KEY_PASS', '--out', $output, $aligned)
} finally { Remove-Item Env:YX_APK_KEY_PASS -ErrorAction SilentlyContinue }
Run-Checked $apksigner @('verify', '--verbose', $output)
Write-Output "APK: $output"
