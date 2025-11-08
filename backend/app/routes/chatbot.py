from flask import Blueprint, request
from ..services.chatbot_service import generate_reply
from ..utils.errors import error_response, success_response

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("", methods=["POST"])
def chat():
    """Chat with the chatbot"""
    try:
        data = request.get_json() or {}
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return error_response("Message is required", 400)
        
        if len(user_message) > 1000:  # Reasonable limit
            return error_response("Message is too long (max 1000 characters)", 400)
        
        reply = generate_reply(user_message)
        
        return success_response(data={"reply": reply}, status_code=200)
    
    except Exception as e:
        return error_response("An error occurred while processing your message", 500, {"details": str(e)})
