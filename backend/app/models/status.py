from ..extensions import db
from datetime import datetime, timezone
from sqlalchemy import func

class SystemStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    region = db.Column(db.String(100))
    status = db.Column(db.String(20))        # up/degraded/down
    last_updated = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<SystemStatus {self.region}: {self.status}>"
