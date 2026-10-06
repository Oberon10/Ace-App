// Import the jsonwebtoken library to verify and decode signed JWT authorization tokens
import jwt from "jsonwebtoken";

/**
 * Authentication Middleware: Verifies JSON Web Token from HTTP Authorization Header.
 * Extracts the Bearer token, verifies its signature against JWT_SECRET, and attaches the
 * decoded user payload (id, role, email) to the Express Request object (req.user).
 */
export const authenticateToken = (req, res, next) => {
    // Retrieve the raw authorization header from the incoming HTTP request headers
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    // Check if the authorization header exists and starts with the "Bearer " scheme prefix
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Return HTTP 401 Unauthorized response if token is missing or improperly formatted
        return res.status(401).json({
            // Boolean indicator for unsuccessful response
            success: false,
            // Descriptive error message informing the client that a valid token is required
            message: "Authentication token is missing. Please provide a Bearer token in Authorization header."
        });
    }

    // Extract the raw token string by splitting on space and selecting the second element
    const token = authHeader.split(" ")[1];

    // Verify token validity and signature using the secret key stored in environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        // Handle scenario where token verification failed (expired, tampered, or invalid signature)
        if (err) {
            // Return HTTP 403 Forbidden response indicating the token cannot be authorized
            return res.status(403).json({
                // Boolean indicator for unsuccessful response
                success: false,
                // Descriptive error message detailing invalid or expired authentication token
                message: "Invalid or expired authentication token.",
                // Return specific error name (e.g., TokenExpiredError or JsonWebTokenError)
                error: err.name
            });
        }

        // Attach the verified decoded user payload containing id, email, and role to the request object
        req.user = decodedUser;

        // Proceed to the next middleware or route handler in the Express request-response cycle
        next();
    });
};

/**
 * Role-Based Access Control (RBAC) Middleware.
 * Accepts a list of allowed roles (e.g., 'ADMIN', 'DISPATCHER') and ensures the authenticated
 * user's role matches at least one of the permitted roles before granting access.
 *
 * @param {...string} allowedRoles - List of permitted role names
 * @returns {Function} Express middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
    // Return the Express middleware function with access to req, res, and next
    return (req, res, next) => {
        // Verify that the request object has an authenticated user attached by authenticateToken
        if (!req.user || !req.user.role) {
            // Return HTTP 401 Unauthorized if user context is missing from request
            return res.status(401).json({
                // Boolean failure indicator
                success: false,
                // Error message
                message: "User context not found. Authentication required prior to authorization."
            });
        }

        // Check if the authenticated user's role is included in the allowed roles array
        if (!allowedRoles.includes(req.user.role)) {
            // Return HTTP 403 Forbidden when authenticated user lacks the required role permissions
            return res.status(403).json({
                // Boolean failure indicator
                success: false,
                // Informative error message outlining the insufficient privilege level
                message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required role(s): [${allowedRoles.join(", ")}].`
            });
        }

        // User role is authorized; continue to the next middleware or controller function
        next();
    };
};

// Default export combining both middleware functions
export default {
    authenticateToken,
    authorizeRoles
};
