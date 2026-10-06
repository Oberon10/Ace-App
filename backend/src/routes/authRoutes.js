// Import the Router module from Express to define modular route endpoints
import { Router } from "express";

// Import authentication controller handler functions
import { register, login, getProfile } from "../controllers/authController.js";

// Import JWT authentication middleware to protect sensitive profile routes
import { authenticateToken } from "../middleware/auth.js";

// Initialize a new Express router instance for authentication routing
const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer, driver, dispatcher, or admin user
 * @access  Public
 */
router.post(
    // URL path definition for user registration endpoint
    "/register",
    // Controller function executing registration logic and issuing JWT
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials (email & password) and return JWT
 * @access  Public
 */
router.post(
    // URL path definition for user login endpoint
    "/login",
    // Controller function verifying credentials and returning user session token
    login
);

/**
 * @route   GET /api/auth/me
 * @desc    Retrieve profile data of currently authenticated user
 * @access  Private (Requires valid JWT Bearer token)
 */
router.get(
    // URL path definition for current user profile endpoint
    "/me",
    // Authentication guard middleware validating token header
    authenticateToken,
    // Controller function returning profile information
    getProfile
);

// Export router instance as the default ES module export
export default router;
