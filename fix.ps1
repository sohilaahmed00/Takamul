$path = 'src/pages/AddProduct.tsx'
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)
$idx = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'const buildFormData = useCallback\(') { $idx += $i }
}
Write-Host "found: $($idx -join ', ')"
if ($idx.Count -gt 1) {
    $first = $idx[0]
    $second = $idx[1]
    $new = $lines[0..($first-1)] + $lines[$second..($lines.Length-1)]
    [System.IO.File]::WriteAllLines($path, $new, [System.Text.Encoding]::UTF8)
    Write-Host 'removed first block'
}
