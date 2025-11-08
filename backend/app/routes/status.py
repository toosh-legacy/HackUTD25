from flask import Blueprint
from sqlalchemy.exc import SQLAlchemyError
from ..models.status import SystemStatus
from ..utils.errors import error_response, success_response

status_bp = Blueprint("status", __name__)


@status_bp.route("", methods=["GET"])
def get_status():
    """Get system status for all regions"""
    try:
        statuses = SystemStatus.query.all()
        
        return success_response(data={
            "statuses": [
                {
                    "id": s.id,
                    "region": s.region,
                    "status": s.status,
                    "last_updated": s.last_updated.isoformat() if s.last_updated else None
                } for s in statuses
            ],
            "count": len(statuses)
        }, status_code=200)
    
    except SQLAlchemyError as e:
        return error_response("Database error occurred", 500, {"details": str(e)})
    except Exception as e:
        return error_response("An error occurred while fetching status", 500, {"details": str(e)})
