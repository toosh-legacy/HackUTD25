from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models.user import User
from ..utils.validators import validate_email, validate_password
from ..utils.errors import error_response, success_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user"""
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        
        # Validate input
        if not email or not password:
            return error_response("Email and password are required", 400)
        
        if not validate_email(email):
            return error_response("Invalid email format", 400)
        
        is_valid, error_msg = validate_password(password)
        if not is_valid:
            return error_response(error_msg, 400)
        
        # Security: Prevent role setting on signup - always set to "user"
        # Admins must be created directly in the database or through admin endpoint
        user = User(email=email, role="user")
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return success_response("User created successfully", {"user_id": user.id}, 201)
    
    except IntegrityError:
        db.session.rollback()
        return error_response("Email already registered", 400)
    except ValueError as e:
        db.session.rollback()
        # Handle password hashing errors
        if "72 bytes" in str(e):
            return error_response("Password is too long. Maximum 72 characters allowed.", 400)
        return error_response("Invalid input", 400, {"details": str(e)})
    except Exception as e:
        db.session.rollback()
        import traceback
        return error_response("An error occurred during registration", 500, {"details": str(e), "type": type(e).__name__})


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return JWT token"""
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        
        if not email or not password:
            return error_response("Email and password are required", 400)
        
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return error_response("Invalid email or password", 401)
        
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        return success_response("Login successful", {
            "access_token": access_token,
            "role": user.role,
            "user_id": user.id
        }, 200)
    
    except Exception as e:
        return error_response("An error occurred during login", 500, {"details": str(e)})


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Get current user information"""
    try:
        identity = get_jwt_identity()
        if not identity:
            return error_response("Invalid token", 401)
        
        user = User.query.get(identity.get("id"))
        if not user:
            return error_response("User not found", 404)
        
        return success_response(data={
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }, status_code=200)
    except Exception as e:
        return error_response("An error occurred", 500, {"details": str(e)})
