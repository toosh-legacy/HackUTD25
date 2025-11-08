"""
Standardized error response utilities
"""
from flask import jsonify
from typing import Any, Dict, Optional, Tuple


def error_response(message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None) -> Tuple:
    """
    Create a standardized error response.
    
    Args:
        message: Error message
        status_code: HTTP status code
        details: Additional error details (optional)
    
    Returns:
        Tuple of (jsonify response, status_code)
    """
    response = {"error": message}
    if details:
        response["details"] = details
    return jsonify(response), status_code


def success_response(message: Optional[str] = None, data: Optional[Dict[str, Any]] = None, status_code: int = 200) -> Tuple:
    """
    Create a standardized success response.
    
    Args:
        message: Success message (optional)
        data: Response data (optional)
        status_code: HTTP status code
    
    Returns:
        Tuple of (jsonify response, status_code)
    """
    response = {}
    if message:
        response["message"] = message
    if data:
        response.update(data)
    return jsonify(response), status_code

