import time
import requests

BASE = "http://127.0.0.1:5000"

def call(path, method="GET", json=None):
    url = BASE + path
    try:
        if method == "GET":
            r = requests.get(url, timeout=5)
        else:
            r = requests.post(url, json=json, timeout=5)
        print(f"{method} {path} -> {r.status_code}")
        try:
            print(r.json())
        except Exception:
            print(r.text[:200])
    except Exception as e:
        print(f"ERROR calling {path}: {e}")


def run_once():
    call("/api/health")
    call("/api/happiness")
    call("/api/status")
    call("/api/chatbot", method="POST", json={"message": "I have an outage in my area"})
    call("/api/feedback", method="POST", json={"message": "My service is slow"})


if __name__ == "__main__":
    # run a few times with short pause
    for i in range(3):
        print(f"Run {i+1}")
        run_once()
        time.sleep(1)
