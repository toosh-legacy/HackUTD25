from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from ..extensions import db
from ..models.feedback import Feedback
from ..services.categorization_service import categorize_feedback_text
from ..utils.errors import error_response, success_response

feedback_bp = Blueprint("feedback", __name__)


@feedback_bp.route("", methods=["POST"])
@jwt_required(optional=True)
def submit_feedback():
    """Submit feedback"""
    try:
        identity = get_jwt_identity()
        data = request.get_json() or {}
        
        message = data.get("message", "").strip()
        if not message:
            return error_response("Message is required", 400)
        
        if len(message) > 10000:  # Reasonable limit
            return error_response("Message is too long (max 10000 characters)", 400)
        
        user_id = None
        if identity:
            user_id = identity.get("id")
        
        fb = Feedback(
            user_id=user_id,
            issue_type=data.get("issue_type", "").strip()[:50] if data.get("issue_type") else None,
            severity=data.get("severity", "").strip().lower() if data.get("severity") else None,
            location=data.get("location", "").strip()[:100] if data.get("location") else None,
            message=message,
        )
        fb.category = categorize_feedback_text(message)
        
        db.session.add(fb)
        db.session.commit()
        
        return success_response("Feedback submitted successfully", {"id": fb.id}, 201)
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return error_response("Database error occurred", 500, {"details": str(e)})
    except Exception as e:
        db.session.rollback()
        return error_response("An error occurred while submitting feedback", 500, {"details": str(e)})


@feedback_bp.route("", methods=["GET"])
@jwt_required()
def list_feedback():
    """Get all feedback (admin only)"""
    try:
        identity = get_jwt_identity()
        if not identity or identity.get("role") != "admin":
            return error_response("Admin access required", 403)
        
        feedback_list = Feedback.query.order_by(Feedback.created_at.desc()).all()
        
        return success_response(data={
            "feedback": [
                {
                    "id": f.id,
                    "user_id": f.user_id,
                    "issue_type": f.issue_type,
                    "severity": f.severity,
                    "location": f.location,
                    "message": f.message,
                    "status": f.status,
                    "category": f.category,
                    "created_at": f.created_at.isoformat() if f.created_at else None
                } for f in feedback_list
            ],
            "count": len(feedback_list)
        }, status_code=200)
    
    except Exception as e:
        return error_response("An error occurred while fetching feedback", 500, {"details": str(e)})
