from datetime import datetime, timedelta, timezone
from sqlalchemy.exc import SQLAlchemyError
from ..models.feedback import Feedback
from ..models.alert import Alert

def calculate_happiness_index():
    """
    Calculate the happiness index based on recent feedback and alerts.
    Returns a score between 0 and 100.
    """
    try:
        now = datetime.now(timezone.utc)
        window = now - timedelta(hours=6)

        # Query recent feedback and alerts
        recent_feedback = Feedback.query.filter(
            Feedback.created_at >= window
        ).all()
        
        recent_alerts = Alert.query.filter(
            Alert.created_at >= window
        ).all()

        base = 100.0

        # Deduct points based on feedback severity
        for f in recent_feedback:
            sev = (f.severity or "").lower()
            if sev == "high":
                base -= 3
            elif sev == "medium":
                base -= 2
            elif sev == "low":
                base -= 1

        # Deduct points based on alert level
        for a in recent_alerts:
            lvl = (a.level or "").lower()
            if lvl == "critical":
                base -= 10
            elif lvl == "warning":
                base -= 5
            elif lvl == "info":
                base -= 1

        # Ensure score is between 0 and 100
        base = max(0, min(100, base))
        return round(base, 1)
    
    except SQLAlchemyError as e:
        raise Exception(f"Database error calculating happiness index: {str(e)}")
    except Exception as e:
        raise Exception(f"Error calculating happiness index: {str(e)}")
