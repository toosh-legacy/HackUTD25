# Quick Start Script for Reddit Integration
# Run this in separate terminals

Write-Host "=== Reddit Sentiment Integration ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "You need to run these commands in 3 SEPARATE PowerShell terminals:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Main Backend (Port 4000):" -ForegroundColor Green
Write-Host "  cd backend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Terminal 2 - Reddit Happiness Server (Port 3001):" -ForegroundColor Green  
Write-Host "  cd backend"
Write-Host "  node reddit-happiness-server.js"
Write-Host ""
Write-Host "Terminal 3 - Python Scraper (Optional):" -ForegroundColor Green
Write-Host "  cd backend"
Write-Host "  python reddit-scraper.py"
Write-Host ""
Write-Host "Note: A test happiness.json file has been created." -ForegroundColor Cyan
Write-Host "You can test without the Python scraper first!" -ForegroundColor Cyan
