# Backend Server Startup Script
Write-Host "=== Starting Backend Server ===" -ForegroundColor Green
Write-Host ""

# Navigate to script directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Check if activation was successful
if ($LASTEXITCODE -eq 0 -or $env:VIRTUAL_ENV) {
    Write-Host "Virtual environment activated!" -ForegroundColor Green
    Write-Host ""
    
    # Run the server
    Write-Host "Starting server on http://localhost:5000..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    Write-Host ""
    
    python wsgi.py
} else {
    Write-Host "Error: Could not activate virtual environment" -ForegroundColor Red
    Write-Host "Please run: .\venv\Scripts\Activate.ps1 manually" -ForegroundColor Yellow
    pause
}

