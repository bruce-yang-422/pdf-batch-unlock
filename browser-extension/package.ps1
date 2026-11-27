$ErrorActionPreference = 'Stop'

& node (Join-Path $PSScriptRoot 'build.mjs')
if ($LASTEXITCODE -ne 0) {
    throw 'Extension build failed.'
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$unpackedPath = Join-Path $PSScriptRoot 'dist'
$releasePath = Join-Path $PSScriptRoot 'release'
$manifest = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $unpackedPath 'manifest.json') | ConvertFrom-Json
if ($manifest.manifest_version -ne 3 -or $manifest.version -notmatch '^\d+(\.\d+){0,3}$') {
    throw 'Invalid Manifest V3 version.'
}

[void][System.IO.Directory]::CreateDirectory($releasePath)
$zipPath = Join-Path $releasePath "pdf-toolbox-v$($manifest.version).zip"
$temporaryZip = Join-Path $releasePath ('pdf-toolbox-' + [Guid]::NewGuid().ToString('N') + '.tmp')
try {
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        $unpackedPath, $temporaryZip, [System.IO.Compression.CompressionLevel]::Optimal, $false
    )
    $archive = [System.IO.Compression.ZipFile]::OpenRead($temporaryZip)
    try {
        if ($null -eq $archive.GetEntry('manifest.json')) {
            throw 'The ZIP must contain manifest.json at its root.'
        }
    } finally {
        $archive.Dispose()
    }
    Move-Item -LiteralPath $temporaryZip -Destination $zipPath -Force
} finally {
    if (Test-Path -LiteralPath $temporaryZip) {
        Remove-Item -LiteralPath $temporaryZip
    }
}

Write-Output "Release package: $zipPath"
