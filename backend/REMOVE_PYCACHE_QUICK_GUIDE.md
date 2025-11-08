# Quick Guide: Remove __pycache__ from Git

## If you're in a Git Repository:

### Quick Commands (Run from git repository root):

```powershell
# Option 1: Run the PowerShell script
cd C:\Users\tusha\Documents\UT_Dallas\hackutd25
.\HackUTD25\backend\remove_pycache_from_git.ps1

# Option 2: Manual commands
git rm -r --cached **/__pycache__
git rm --cached **/*.pyc
git add HackUTD25/backend/.gitignore
git commit -m "Remove __pycache__ files from git tracking"
```

### What This Does:

1. ✅ Removes `__pycache__` directories from git tracking (keeps them on disk)
2. ✅ Removes `.pyc` files from git tracking (keeps them on disk)
3. ✅ Adds `.gitignore` to prevent future additions
4. ✅ Commits the changes

### After Running:

- `__pycache__` files will no longer be tracked by git
- Files remain on your computer (not deleted)
- Future `__pycache__` files will be automatically ignored
- You can safely commit and push without cache files

---

## If You Haven't Initialized Git Yet:

1. **Initialize git repository** (if needed):
   ```powershell
   cd C:\Users\tusha\Documents\UT_Dallas\hackutd25
   git init
   ```

2. **Then run the removal script** (see above)

---

## Verify It Worked:

```powershell
# Check git status - should NOT show __pycache__ files
git status

# Verify .gitignore is working
git status --ignored
```

---

## That's It!

Your `__pycache__` files are now removed from git tracking and will be ignored in all future commits! 🎉

