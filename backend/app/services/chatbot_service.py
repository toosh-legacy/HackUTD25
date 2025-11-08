def generate_reply(message: str) -> str:
    text = (message or "").lower()
    if "outage" in text or "no service" in text:
        return "I see you might be experiencing an outage. Share your ZIP code so we can check your area status."
    if "slow" in text:
        return "It looks like a speed issue. Try restarting your device, and we’ll also flag this to our team."
    return "Thanks for your feedback. We’ve recorded it and will use it to improve your experience."
