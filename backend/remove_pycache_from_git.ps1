# Script to Remove __pycache__ Files from Git Tracking
# Run this script from your git repository root directory

Write-Host "=== Removing __pycache__ Files from Git Tracking ===" -ForegroundColor Green
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "Error: Not in a git repository!" -ForegroundColor Red
    Write-Host "Please navigate to your git repository root and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Git repository found!" -ForegroundColor Green
Write-Host ""

# Find all __pycache__ directories in git
Write-Host "Finding __pycache__ directories..." -ForegroundColor Yellow
$pycacheDirs = git ls-files | Where-Object { $_ -like "*__pycache__*" }

if ($pycacheDirs) {
    Write-Host "Found $($pycacheDirs.Count) __pycache__ files/directories to remove" -ForegroundColor Cyan
    Write-Host ""
    
    # Remove each __pycache__ directory/file from git tracking
    foreach ($file in $pycacheDirs) {
        Write-Host "Removing: $file" -ForegroundColor Gray
        git rm -r --cached $file 2>&1 | Out-Null
    }
    
    Write-Host ""
    Write-Host "Removed all __pycache__ directories from git tracking!" -ForegroundColor Green
} else {
    Write-Host "No __pycache__ files found in git tracking." -ForegroundColor Yellow
}

Write-Host ""

# Find all .pyc files in git
Write-Host "Finding .pyc files..." -ForegroundColor Yellow
$pycFiles = git ls-files | Where-Object { $_ -like "*.pyc" }

if ($pycFiles) {
    Write-Host "Found $($pycFiles.Count) .pyc files to remove" -ForegroundColor Cyan
    Write-Host ""
    
    # Remove each .pyc file from git tracking
    foreach ($file in $pycFiles) {
        Write-Host "Removing: $file" -ForegroundColor Gray
        git rm --cached $file 2>&1 | Out-Null
    }
    
    Write-Host ""
    Write-Host "Removed all .pyc files from git tracking!" -ForegroundColor Green
} else {
    Write-Host "No .pyc files found in git tracking." -ForegroundColor Yellow
}

Write-Host ""

# Check if .gitignore exists
$gitignorePath = "HackUTD25\backend\.gitignore"
if (Test-Path $gitignorePath) {
    Write-Host ".gitignore found at: $gitignorePath" -ForegroundColor Green
    
    # Add .gitignore to staging if not already added
    Write-Host "Adding .gitignore to git..." -ForegroundColor Yellow
    git add $gitignorePath 2>&1 | Out-Null
    Write-Host ".gitignore added!" -ForegroundColor Green
} else {
    Write-Host "Warning: .gitignore not found at $gitignorePath" -ForegroundColor Yellow
    Write-Host "Make sure .gitignore exists before committing." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

# Show current git status
Write-Host "Current git status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Review the changes above" -ForegroundColor White
Write-Host "2. Commit the changes:" -ForegroundColor White
Write-Host "   git commit -m 'Remove __pycache__ files from git tracking and add .gitignore'" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Verify the changes:" -ForegroundColor White
Write-Host "   git status" -ForegroundColor Cyan
Write-Host ""
Write-Host "Done! __pycache__ files are now removed from git tracking." -ForegroundColor Green
Write-Host "The .gitignore will prevent them from being added again in the future." -ForegroundColor Green

