# How to Remove __pycache__ Files from Git Tracking

If you've already added `__pycache__` files to git before creating the `.gitignore`, follow these steps to remove them from git tracking.

## Step-by-Step Instructions

### 1. Navigate to Your Git Repository Root
```powershell
cd C:\Users\tusha\Documents\UT_Dallas\hackutd25
# or wherever your .git folder is located
```

### 2. Verify Git Repository
```powershell
git status
```
If you see "fatal: not a git repository", you need to initialize git first or navigate to the correct directory.

### 3. Remove All __pycache__ Files from Git Tracking
Run these commands to remove all `__pycache__` directories from git tracking (files will remain on disk):

```powershell
# Remove all __pycache__ directories recursively
git rm -r --cached **/__pycache__

# Or if the above doesn't work, use this:
git ls-files | Select-String "__pycache__" | ForEach-Object { git rm --cached $_ }
```

### 4. Remove All .pyc Files from Git Tracking
```powershell
# Remove all .pyc files
git rm --cached **/*.pyc

# Or manually:
git ls-files | Select-String "\.pyc$" | ForEach-Object { git rm --cached $_ }
```

### 5. Verify .gitignore is in Place
Make sure you have the `.gitignore` file in your backend directory:
```powershell
Test-Path HackUTD25\backend\.gitignore
```

### 6. Check What Will Be Removed
```powershell
git status
```
You should see all the `__pycache__` files listed as "deleted" (they're being removed from git tracking, not from your disk).

### 7. Commit the Changes
```powershell
git add .gitignore
git commit -m "Remove __pycache__ files from git tracking and add .gitignore"
```

### 8. Verify They're Gone
```powershell
git status
```
You should no longer see any `__pycache__` files in the status.

---

## Alternative: Remove Everything and Re-add

If you want to be thorough, you can remove everything from git cache and re-add with the .gitignore in place:

### Option A: Remove All Cache Files at Once
```powershell
# Remove all Python cache files
git rm -r --cached HackUTD25/backend/**/__pycache__
git rm --cached HackUTD25/backend/**/*.pyc
git rm --cached HackUTD25/backend/**/*.pyo
git rm --cached HackUTD25/backend/**/*.pyd
```

### Option B: Use PowerShell to Find and Remove
```powershell
# Find all __pycache__ directories in git
git ls-files | Where-Object { $_ -like "*__pycache__*" } | ForEach-Object {
    git rm --cached $_
}

# Find all .pyc files in git
git ls-files | Where-Object { $_ -like "*.pyc" } | ForEach-Object {
    git rm --cached $_
}
```

---

## Complete Script (Copy and Paste)

Run this complete script in PowerShell from your git repository root:

```powershell
# Navigate to git repository root
cd C:\Users\tusha\Documents\UT_Dallas\hackutd25

# Remove all __pycache__ directories
Write-Host "Removing __pycache__ directories from git..." -ForegroundColor Yellow
git ls-files | Where-Object { $_ -like "*__pycache__*" } | ForEach-Object {
    git rm -r --cached $_
    Write-Host "Removed: $_" -ForegroundColor Green
}

# Remove all .pyc files
Write-Host "Removing .pyc files from git..." -ForegroundColor Yellow
git ls-files | Where-Object { $_ -like "*.pyc" } | ForEach-Object {
    git rm --cached $_
    Write-Host "Removed: $_" -ForegroundColor Green
}

# Add .gitignore if not already added
Write-Host "Adding .gitignore..." -ForegroundColor Yellow
git add HackUTD25/backend/.gitignore

# Show status
Write-Host "`nCurrent git status:" -ForegroundColor Cyan
git status

Write-Host "`nDone! Now commit these changes:" -ForegroundColor Green
Write-Host "git commit -m 'Remove __pycache__ files from git tracking'" -ForegroundColor Yellow
```

---

## After Removing from Git

1. **Commit the changes**:
   ```powershell
   git commit -m "Remove __pycache__ files from git tracking"
   ```

2. **Verify .gitignore is working**:
   ```powershell
   git status
   ```
   You should NOT see any `__pycache__` files anymore.

3. **Future commits**:
   The `.gitignore` will prevent any new `__pycache__` files from being added to git.

---

## Important Notes

- `git rm --cached` removes files from git tracking but **keeps them on your disk**
- The files will still exist locally, they just won't be tracked by git
- Make sure to commit the `.gitignore` file as well
- After this, git will ignore all `__pycache__` files going forward

---

## Troubleshooting

### If you get "fatal: not a git repository"
You need to be in a directory that contains a `.git` folder. Navigate to your repository root.

### If you get "pathspec did not match any files"
The files might not be tracked by git yet, or they're in a different location. Check with:
```powershell
git ls-files | Select-String "__pycache__"
```

### If files still show up after committing
Make sure the `.gitignore` file is in the correct location and has the right patterns:
```powershell
Get-Content HackUTD25\backend\.gitignore | Select-String "__pycache__"
```

---

## Quick Reference

```powershell
# 1. Remove from git tracking
git rm -r --cached **/__pycache__

# 2. Add .gitignore
git add .gitignore

# 3. Commit
git commit -m "Remove __pycache__ files from git tracking"

# 4. Verify
git status
```

That's it! Your `__pycache__` files are now removed from git tracking and will be ignored in the future.

