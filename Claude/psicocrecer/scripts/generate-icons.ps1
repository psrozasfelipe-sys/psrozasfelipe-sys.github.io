# Genera los PNG del favicon/manifest a partir de formas dibujadas con
# System.Drawing (no hay ImageMagick/Inkscape disponibles en este entorno).
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "favicon"

$bgColor = [System.Drawing.Color]::FromArgb(255, 0xDC, 0xE6, 0xD6)   # sage-100
$leafColor = [System.Drawing.Color]::FromArgb(255, 0x7C, 0x9B, 0x72) # sage-500

function New-Icon {
    param([int]$size, [string]$path)

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillEllipse($bgBrush, 0, 0, $size, $size)

    $leafBrush = New-Object System.Drawing.SolidBrush($leafColor)
    $g.TranslateTransform($size / 2, $size / 2)
    $g.RotateTransform(-45)
    $w = $size * 0.62
    $h = $size * 0.34
    $g.FillEllipse($leafBrush, -($w / 2), -($h / 2), $w, $h)
    $g.ResetTransform()

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

New-Icon -size 180 -path (Join-Path $outDir "apple-touch-icon.png")
New-Icon -size 192 -path (Join-Path $outDir "icon-192.png")
New-Icon -size 512 -path (Join-Path $outDir "icon-512.png")
New-Icon -size 32  -path (Join-Path $outDir "favicon-32.png")

Write-Host "Iconos generados en $outDir"
