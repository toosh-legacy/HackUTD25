# How to Run the Backend Server

## Quick Start

### Option 1: Direct Python Execution (Easiest)

1. **Open PowerShell** and navigate to the backend directory:
   ```powershell
   cd C:\Users\tusha\Documents\UT_Dallas\hackutd25\HackUTD25\backend
   ```

2. **Activate the virtual environment** (if not already activated):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Run the server**:
   ```powershell
   python wsgi.py
   ```

The server will start on `http://localhost:5000`

### Option 2: Using Flask CLI

1. **Navigate to backend directory**:
   ```powershell
   cd C:\Users\tusha\Documents\UT_Dallas\hackutd25\HackUTD25\backend
   ```

2. **Activate virtual environment**:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Set Flask app environment variable**:
   ```powershell
   $env:FLASK_APP = "wsgi:app"
   ```

4. **Run the server**:
   ```powershell
   flask run --port=5000
   ```

---

## Step-by-Step Instructions

### 1. Open PowerShell
Press `Win + X` and select "Windows PowerShell" or "Terminal"

### 2. Navigate to Backend Directory
```powershell
cd C:\Users\tusha\Documents\UT_Dallas\hackutd25\HackUTD25\backend
```

### 3. Activate Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```

You should see `(venv)` in your prompt after activation.

### 4. Run the Server
```powershell
python wsgi.py
```

### 5. Verify Server is Running
You should see output like:
```
 * Running on http://127.0.0.1:5000
 * Running on http://[::1]:5000
```

### 6. Test the Server
Open a new PowerShell window and test:
```powershell
curl http://localhost:5000/api/health
```

Or open in browser: `http://localhost:5000/api/health`

---

## Running on Different Port

To run on a different port (e.g., 8000):

### Using wsgi.py
Edit `wsgi.py` and change:
```python
app.run(debug=True, port=8000)
```

### Using Flask CLI
```powershell
flask run --port=8000
```

---

## Running in Background (Optional)

To run the server in the background:

### Windows PowerShell
```powershell
Start-Process python -ArgumentList "wsgi.py" -WindowStyle Hidden
```

### Or use `nohup` equivalent
```powershell
Start-Process python -ArgumentList "wsgi.py"
```

---

## Troubleshooting

### Issue: "Cannot activate virtual environment"
**Solution**: Run PowerShell as Administrator, then:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "Module not found"
**Solution**: Make sure virtual environment is activated and dependencies are installed:
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Issue: "Port already in use"
**Solution**: Either:
1. Stop the process using port 5000
2. Run on a different port (see above)

To find what's using port 5000:
```powershell
netstat -ano | findstr :5000
```

### Issue: "Database error"
**Solution**: The database will be created automatically. If issues persist, delete `hackutd.db` and restart the server.

---

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Environment Variables (Optional)

You can set environment variables before running:

```powershell
$env:SECRET_KEY = "your-secret-key"
$env:JWT_SECRET_KEY = "your-jwt-secret"
$env:DATABASE_URL = "sqlite:///hackutd.db"
$env:FLASK_DEBUG = "True"
python wsgi.py
```

---

## Quick Reference

```powershell
# Navigate to backend
cd C:\Users\tusha\Documents\UT_Dallas\hackutd25\HackUTD25\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run server
python wsgi.py

# Test server (in another terminal)
curl http://localhost:5000/api/health
```

---

## Server Endpoints

Once running, the server will be available at:
- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`
- **API Endpoints**: `http://localhost:5000/api/*`

---

## Next Steps

1. Server is running ✅
2. Test endpoints using curl or browser
3. Integrate with frontend
4. Use JWT tokens for authentication

The server will automatically reload when you make code changes (debug mode is enabled).

