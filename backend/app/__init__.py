from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from .config import Config
from .extensions import db, jwt
from .utils.errors import error_response

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS configuration - allow specific origins in production
    # For development, you can use "*" but for production, specify actual origins
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    if cors_origins == "*":
        CORS(app, resources={r"/api/*": {"origins": "*"}})
    else:
        CORS(app, resources={r"/api/*": {"origins": cors_origins.split(",")}})

    # init extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return error_response("Token has expired", 401)
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return error_response("Invalid token", 401)
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return error_response("Authorization token is required", 401)

    # register blueprints
    from .routes.auth import auth_bp
    from .routes.feedback import feedback_bp
    from .routes.alert import alerts_bp
    from .routes.status import status_bp
    from .routes.chatbot import chatbot_bp
    from .routes.scraper import scraper_bp
    from .routes.happiness import happiness_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(alerts_bp, url_prefix="/api/alerts")
    app.register_blueprint(status_bp, url_prefix="/api/status")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")
    app.register_blueprint(scraper_bp, url_prefix="/api/scraper")
    app.register_blueprint(happiness_bp, url_prefix="/api/happiness")

    @app.route("/api/health")
    def health():
        """Health check endpoint"""
        try:
            # Simple database connectivity check
            db.session.execute(text("SELECT 1"))
            return jsonify({"status": "ok", "database": "connected"}), 200
        except Exception as e:
            return jsonify({"status": "error", "database": "disconnected", "error": str(e)}), 503

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        from flask import request
        return error_response(
            f"Endpoint not found: {request.method} {request.path}", 
            404,
            {"available_endpoints": [
                "/api/health",
                "/api/auth/signup",
                "/api/auth/login",
                "/api/auth/me",
                "/api/feedback",
                "/api/alerts",
                "/api/status",
                "/api/chatbot",
                "/api/happiness"
            ]}
        )
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        from flask import request
        return error_response(
            f"Method {request.method} not allowed for {request.path}", 
            405
        )
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return error_response("Internal server error", 500)
    
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(error):
        db.session.rollback()
        return error_response("Database error occurred", 500, {"details": str(error)})

    # Create tables automatically (only in development)
    # In production, use migrations
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            app.logger.warning(f"Could not create tables: {e}")

    return app
