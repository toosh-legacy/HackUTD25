from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from ..extensions import db
from ..models.alert import Alert
from ..utils.errors import error_response, success_response

alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.route("", methods=["GET"])
@jwt_required()
def get_alerts():
    """Get all alerts (admin only)"""
    try:
        identity = get_jwt_identity()
        if not identity or identity.get("role") != "admin":
            return error_response("Admin access required", 403)
        
        alerts = Alert.query.order_by(Alert.created_at.desc()).all()
        
        return success_response(data={
            "alerts": [
                {
                    "id": a.id,
                    "source": a.source,
                    "title": a.title,
                    "details": a.details,
                    "level": a.level,
                    "category": a.category,
                    "is_acknowledged": a.is_acknowledged,
                    "created_at": a.created_at.isoformat() if a.created_at else None
                } for a in alerts
            ],
            "count": len(alerts)
        }, status_code=200)
    
    except Exception as e:
        return error_response("An error occurred while fetching alerts", 500, {"details": str(e)})


@alerts_bp.route("/<int:alert_id>/ack", methods=["POST"])
@jwt_required()
def ack_alert(alert_id):
    """Acknowledge an alert (admin only)"""
    try:
        identity = get_jwt_identity()
        if not identity or identity.get("role") != "admin":
            return error_response("Admin access required", 403)
        
        alert = Alert.query.get(alert_id)
        if not alert:
            return error_response("Alert not found", 404)
        
        if alert.is_acknowledged:
            return error_response("Alert already acknowledged", 400)
        
        alert.is_acknowledged = True
        db.session.commit()
        
        return success_response("Alert acknowledged successfully", status_code=200)
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return error_response("Database error occurred", 500, {"details": str(e)})
    except Exception as e:
        db.session.rollback()
        return error_response("An error occurred while acknowledging alert", 500, {"details": str(e)})
