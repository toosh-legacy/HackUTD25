from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.scraper_service import run_scraper
from ..utils.errors import error_response, success_response

scraper_bp = Blueprint("scraper", __name__)


@scraper_bp.route("/run", methods=["POST"])
@jwt_required()
def run():
    """Run the scraper service (admin only)"""
    try:
        identity = get_jwt_identity()
        if not identity or identity.get("role") != "admin":
            return error_response("Admin access required", 403)
        
        created = run_scraper()
        
        return success_response("Scraper run completed", {"alerts_created": created}, 200)
    
    except Exception as e:
        return error_response("An error occurred while running scraper", 500, {"details": str(e)})
