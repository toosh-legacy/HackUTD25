from ..extensions import db
import bcrypt
from datetime import datetime, timezone
from sqlalchemy import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user", nullable=False)  # "user" or "admin"
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    def set_password(self, password: str):
        """Hash and set the password"""
        # Encode password to bytes, hash it, and decode to string for storage
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        self.password_hash = hashed.decode('utf-8')

    def check_password(self, password: str) -> bool:
        """Verify the password against the hash"""
        try:
            password_bytes = password.encode('utf-8')
            hash_bytes = self.password_hash.encode('utf-8')
            return bcrypt.checkpw(password_bytes, hash_bytes)
        except Exception:
            return False
    
    def __repr__(self):
        return f"<User {self.id}: {self.email}>"
