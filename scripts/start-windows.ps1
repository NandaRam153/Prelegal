#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Set-Location $ProjectDir

Write-Host "Building and starting Prelegal..." -ForegroundColor Cyan
docker compose up --build -d

Write-Host "Prelegal is running at http://localhost:8000" -ForegroundColor Green
