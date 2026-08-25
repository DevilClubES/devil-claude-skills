[CmdletBinding()]
param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$ClaudeRoot,
    [string]$CodexRoot,
    [ValidatePattern('^[A-Za-z0-9_.@:-]+$')]
    [string]$VpsHost,
    [ValidatePattern('^/[A-Za-z0-9._/-]+$')]
    [string]$VpsClaudeRoot
)

$ErrorActionPreference = 'Stop'
$script:Failures = 0

function Get-RelativeFileMap {
    param([Parameter(Mandatory)][string]$Root)

    $resolved = (Resolve-Path -LiteralPath $Root).Path
    $map = @{}
    Get-ChildItem -LiteralPath $resolved -Recurse -File | ForEach-Object {
        $relative = [IO.Path]::GetRelativePath($resolved, $_.FullName).Replace('\', '/')
        $map[$relative] = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
    return $map
}

function Compare-PluginTree {
    param(
        [Parameter(Mandatory)][string]$Label,
        [Parameter(Mandatory)][string]$Source,
        [Parameter(Mandatory)][string]$Installed
    )

    if (-not (Test-Path -LiteralPath $Installed -PathType Container)) {
        Write-Warning "ERROR: $Label root does not exist: $Installed"
        $script:Failures++
        return
    }

    $before = $script:Failures
    $sourceMap = Get-RelativeFileMap -Root $Source
    $installedMap = Get-RelativeFileMap -Root $Installed
    foreach ($path in $sourceMap.Keys | Sort-Object) {
        if (-not $installedMap.ContainsKey($path)) {
            Write-Warning "ERROR: $Label missing $path"
            $script:Failures++
        }
        elseif ($sourceMap[$path] -ne $installedMap[$path]) {
            Write-Warning "ERROR: $Label differs at $path"
            $script:Failures++
        }
    }
    if ($script:Failures -eq $before) {
        Write-Output "PASS: $Label matches the repository package ($($sourceMap.Count) files checked)."
    }
}

$resolvedRepository = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$claudeSource = Join-Path $resolvedRepository 'plugins/design-skills'
$codexSource = Join-Path $resolvedRepository 'plugins/design-skills-codex'

& node (Join-Path $resolvedRepository 'scripts/sync-codex-package.mjs') --check
if ($LASTEXITCODE -ne 0) {
    throw 'Generated Codex package is stale; runtime comparison stopped.'
}

$claudeVersion = (Get-Content -LiteralPath (Join-Path $claudeSource '.claude-plugin/plugin.json') -Raw | ConvertFrom-Json).version
$codexVersion = (Get-Content -LiteralPath (Join-Path $codexSource '.codex-plugin/plugin.json') -Raw | ConvertFrom-Json).version
if ($claudeVersion -ne $codexVersion) {
    Write-Warning "ERROR: repository versions differ: Claude $claudeVersion, Codex $codexVersion"
    $script:Failures++
}
else {
    Write-Output "PASS: repository Claude and Codex versions are both $claudeVersion."
}

if ($ClaudeRoot) {
    Compare-PluginTree -Label 'local Claude plugin' -Source $claudeSource -Installed $ClaudeRoot
}
if ($CodexRoot) {
    Compare-PluginTree -Label 'local Codex plugin' -Source $codexSource -Installed $CodexRoot
}

if ($VpsHost -or $VpsClaudeRoot) {
    if (-not ($VpsHost -and $VpsClaudeRoot)) {
        throw 'Use -VpsHost and -VpsClaudeRoot together.'
    }

    $probe = @"
import hashlib, json
from pathlib import Path
root = Path(r'$VpsClaudeRoot')
files = sorted(path for path in root.rglob('*') if path.is_file())
if len(files) > 512:
    raise SystemExit('too many files for bounded probe')
result = {}
for path in files:
    if path.stat().st_size > 2 * 1024 * 1024:
        raise SystemExit('file exceeds bounded probe size')
    result[path.relative_to(root).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
print(json.dumps(result, sort_keys=True))
"@
    $encodedProbe = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($probe))
    $remoteCommand = 'python3 -c "import base64;exec(base64.b64decode(''{0}''))"' -f $encodedProbe
    $remoteJson = & ssh -- $VpsHost $remoteCommand
    if ($LASTEXITCODE -ne 0) {
        throw "VPS probe failed for $VpsHost"
    }
    $remoteMap = $remoteJson | ConvertFrom-Json -AsHashtable
    $sourceMap = Get-RelativeFileMap -Root $claudeSource
    $before = $script:Failures
    foreach ($path in $sourceMap.Keys | Sort-Object) {
        if (-not $remoteMap.ContainsKey($path)) {
            Write-Warning "ERROR: VPS Claude plugin missing $path"
            $script:Failures++
        }
        elseif ($sourceMap[$path] -ne $remoteMap[$path]) {
            Write-Warning "ERROR: VPS Claude plugin differs at $path"
            $script:Failures++
        }
    }
    if ($script:Failures -eq $before) {
        Write-Output "PASS: VPS Claude plugin matches the repository package ($($sourceMap.Count) files checked)."
    }
}

if ($script:Failures -gt 0) {
    Write-Error "FAIL: $script:Failures synchronization difference(s)."
    exit 1
}

Write-Output 'PASS: all requested runtime synchronization checks completed.'
