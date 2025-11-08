from ..extensions import db
from ..models.alert import Alert
from sqlalchemy.exc import SQLAlchemyError

def run_scraper():
    """
    Run the scraper service to check for external signals and create alerts.
    Returns the number of alerts created.
    """
    try:
        # Demo: in real life, fetch external signals from APIs, databases, etc.
        # This is a placeholder implementation
        alert = Alert(
            source="scraper",
            title="Spike in complaints: Austin",
            details="External data suggests a degradation.",
            level="warning",
            category="network"
        )
        db.session.add(alert)
        db.session.commit()
        return 1
    except SQLAlchemyError as e:
        db.session.rollback()
        raise Exception(f"Database error in scraper: {str(e)}")
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Error running scraper: {str(e)}")
