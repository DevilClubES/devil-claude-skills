# CATTLE bajo demanda

Repositorio: `DevilClubES/devil-claude-skills`. Estado de esta integración: **SOURCE_ONLY**.
La presencia de esta rama y sus archivos no acredita instalación, un job ejecutado, pruebas de producto, merge ni despliegue.

Fuente común DOS: `c5da6a0599ac5df236c1c2002fc6cb9a90014457`; workflow LF SHA-256: `0f10836547683c68a810f0a335fad2cca9bab588dbe78b16d3b3d9ab8b7f8013`.
Registro LF SHA-256: `dd3384b19700e55fa4ea00d58f8a89747204d406df3a07d2906faafc49616c7f`. Base auditada: `95014a0caf04f9232aefa07aa3dea1a77cd4189f` (`main`).

## Perfiles admitidos

| Perfil | Autoridad |
|---|---|
| `canary` | `INFRASTRUCTURE_ONLY` |

El perfil `canary` mide exclusivamente infraestructura (Node 20 y controles del entorno). Su autoridad es `INFRASTRUCTURE_ONLY`: las pruebas del producto quedan `NOT_RUN`.
Los demás perfiles aportan evidencia de su banco exacto; nunca sustituyen revisiones, firmas, merge, deploy ni gates del repositorio.

## Solicitar un job

Los controladores todavía pueden estar en una rama de DOS sin integrar en `main`. Obtén estos cuatro archivos de código desde la fuente exacta indicada; no contienen credenciales privadas. Necesitas PowerShell 7 y `gh` autenticado con lectura de DOS y permiso de dispatch en este repositorio.
Este arranque descarga solo código a `D:\AI\Runtime\CATTLE\<commit>`; no crea clone, checkout ni worktree. Comprueba el hash Git del contenido, el SHA-256 descargado y cualquier archivo ya existente. Un archivo distinto se conserva y detiene el arranque.
GitHub y SSH privados permanecen en el desktop del controlador; no se heredan secretos de producción al candidato.

```powershell
$ErrorActionPreference = 'Stop'
$CattleSource = 'c5da6a0599ac5df236c1c2002fc6cb9a90014457'
$CattleHome = Join-Path 'D:\AI\Runtime\CATTLE' $CattleSource
$paths = @(
    'ops/ci-runner/cattle/run-consumer.ps1',
    'ops/ci-runner/cattle/ensure-pool.ps1',
    'ops/ci-runner/cattle/repository-profiles.json',
    'ops/ci-runner/cattle/consumer-workflow.yml'
)
$downloads = foreach ($path in $paths) {
    $raw = & gh api "repos/DevilClubES/dos/contents/$($path)?ref=$CattleSource"
    if ($LASTEXITCODE -ne 0) { throw "No se pudo leer el controlador exacto: $path" }
    $item = $raw | ConvertFrom-Json
    if ($item.path -cne $path -or $item.type -cne 'file' -or $item.encoding -cne 'base64') {
        throw "Respuesta de controlador inesperada: $path"
    }
    $bytes = [Convert]::FromBase64String($item.content)
    $header = [Text.Encoding]::ASCII.GetBytes("blob $($bytes.Length)" + [char]0)
    $blobBytes = [byte[]]::new($header.Length + $bytes.Length)
    [Array]::Copy($header, 0, $blobBytes, 0, $header.Length)
    [Array]::Copy($bytes, 0, $blobBytes, $header.Length, $bytes.Length)
    $h = [Security.Cryptography.SHA1]::Create()
    try { $blob = [Convert]::ToHexString($h.ComputeHash($blobBytes)).ToLowerInvariant() } finally { $h.Dispose() }
    if ($blob -cne $item.sha) { throw "Hash Git del controlador no coincide: $path" }
    $h = [Security.Cryptography.SHA256]::Create()
    try { $sha256 = [Convert]::ToHexString($h.ComputeHash($bytes)).ToLowerInvariant() } finally { $h.Dispose() }
    [pscustomobject]@{ path = $path; name = [IO.Path]::GetFileName($path); bytes = $bytes; blob = $blob; sha256 = $sha256 }
}
[void][IO.Directory]::CreateDirectory($CattleHome)
$proof = foreach ($download in $downloads) {
    $target = Join-Path $CattleHome $download.name
    $state = 'DOWNLOADED_VERIFIED'
    if (Test-Path -LiteralPath $target) {
        if (-not (Test-Path -LiteralPath $target -PathType Leaf) -or
            (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant() -cne $download.sha256) {
            throw "Archivo existente distinto: se conserva $target"
        }
        $state = 'EXISTING_VERIFIED'
    } else {
        # CreateNew rejects a competing creation instead of overwriting it.
        $stream = [IO.File]::Open($target, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
        try { $stream.Write($download.bytes, 0, $download.bytes.Length); $stream.Flush($true) } finally { $stream.Dispose() }
        if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant() -cne $download.sha256) {
            throw "Hash del archivo descargado no coincide: $target"
        }
    }
    [pscustomobject]@{ source = $CattleSource; path = $target; git_blob = $download.blob; sha256 = $download.sha256; state = $state }
}
$proof | ConvertTo-Json -Depth 4
```

Conserva `$CattleHome` en esta sesión y solicita el canary:

```powershell
pwsh -NoProfile -File "$CattleHome/run-consumer.ps1" -Repository 'DevilClubES/devil-claude-skills' -TargetSha '<SHA exacto de 40 caracteres>' -Profile canary -RequestOnly
```

`-RequestOnly` valida y encola en GitHub sin SSH ni admin. También puedes seleccionar un PR abierto del mismo repositorio con `-PullRequest <n>` en lugar de `-TargetSha`.
El controlador fija el SHA del sujeto, la fuente común y `base_sha` de la rama por defecto antes del dispatch. No usa una base que avance mientras se ejecuta el banco.
Una solicitud validada no acredita un runner disponible. El controlador del pool provisiona según demanda; una VM de otro repositorio produce `QUEUED_WAITING_OTHER_REPOSITORY` y se conserva.
La fuente descargada sigue siendo `SOURCE_ONLY`: obtener el código no activa el pool ni garantiza provisión automática o ejecución real del job. Exige los recibos operativos y resultados de GitHub para esa afirmación.
Sin `-RequestOnly`, el controlador autorizado consulta el pool y puede pedir una generación nueva. No ejecuta código candidato en el host privilegiado.

## Capacidad y custodia

- Un solo slot pesado activo en todo el VPS, compartido por los repositorios admitidos.
- Guest: 4 vCPU, 6 GiB de RAM y techo de memoria de 7 GiB. El disco del VPS de 50 GB se comparte con VideoFactory y CATTLE; no son 50 GB privados para cada job.
- Selector exclusivo: `cattle`, `kvm`, `dos-cattle-r18`, `dos-cattle-repo-devil-claude-skills`, `dos-cattle-slot-01` (slot también admite `02`/`03`, manteniendo el límite global de uno).
- Los consumidores se registran sin labels predeterminados: no tienen `self-hosted`, `Linux` ni `X64`. No añadir un selector genérico que capture jobs ordinarios.
- Cada generación es nueva y efímera. No se detiene ni reasigna una VM basándose únicamente en `busy=false`.
- El registro del runner usa un token corto ligado al repositorio, enviado por stdin al helper confiable. Ningún token privado va en argv, documentación, Git ni logs.
- El token readonly del mismo repositorio se usa para fetch y se elimina antes de checkout/ejecución candidata. No se heredan secretos ni credenciales de despliegue.
- GitHub y el host no forman una transacción atómica: una cancelación posterior al último snapshot puede competir con el registro.

## Bancos y exclusiones

### `canary`

```bash
node --version
node --test "$RUNNER_TEMP/cattle-consumer-canary.test.cjs"
```

Contratos excluidos de esta integración:

- no product bank admitted; infrastructure canary only
- deploy,production secrets and privileged/Docker services

## Evidencia y siguiente frontera

El push del archivo en `codex/cattle-on-demand` solo registra el workflow: debe observarse `gate_skipped` sin runner. El recibo del publicador deja esa observación en `PENDING` hasta leer el run real.
Un canary PASS únicamente prueba ese entorno y generación. Para afirmar un banco de producto, exige sujeto/base/fuente/tree exactos, comandos y resultados reales del job, artefactos y recibo. Mantén `NOT_RUN`/`UNKNOWN` donde falte evidencia.
Esta documentación no cambia el CI ordinario, propietarios activos, política de revisión, merge, deploy ni activación del repositorio.
