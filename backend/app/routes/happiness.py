from flask import Blueprint
from sqlalchemy.exc import SQLAlchemyError
from ..services.happiness_service import calculate_happiness_index
from ..utils.errors import error_response, success_response

happiness_bp = Blueprint("happiness", __name__)


@happiness_bp.route("", methods=["GET"])
def get_index():
    """Get happiness index"""
    try:
        score = calculate_happiness_index()
        return success_response(data={"happiness_index": score}, status_code=200)
    
    except SQLAlchemyError as e:
        return error_response("Database error occurred", 500, {"details": str(e)})
    except Exception as e:
        return error_response("An error occurred while calculating happiness index", 500, {"details": str(e)})
