from ..extensions import db
from datetime import datetime, timezone
from sqlalchemy import func

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(50))      # "scraper", "feedback", etc.
    title = db.Column(db.String(200))
    details = db.Column(db.Text)
    level = db.Column(db.String(20))       # info/warning/critical
    category = db.Column(db.String(50))
    is_acknowledged = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Alert {self.id}: {self.title}>"
