def categorize_feedback_text(message: str) -> str:
    text = (message or "").lower()
    if "slow" in text or "lag" in text:
        return "network_performance"
    if "no service" in text or "dropped" in text or "outage" in text:
        return "outage"
    if "bill" in text or "charge" in text:
        return "billing"
    return "other"
