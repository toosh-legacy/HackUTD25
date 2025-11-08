from ..extensions import db
from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import relationship

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    issue_type = db.Column(db.String(50))
    severity = db.Column(db.String(20))         # e.g. low/medium/high
    location = db.Column(db.String(100))        # e.g. "Dallas, TX"
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="new")
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", backref="feedback")
    
    def __repr__(self):
        return f"<Feedback {self.id}: {self.issue_type}>"
