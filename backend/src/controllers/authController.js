// Import bcryptjs for secure asynchronous password hashing and salt generation
import bcrypt from "bcryptjs";

// Import jsonwebtoken library to generate digitally signed JSON Web Tokens for authentication
import jwt from "jsonwebtoken";

// Import the Mongoose User data model to query and persist user documents in MongoDB
import User from "../models/User.js";

/**
 * Utility helper function to sign a JWT token with user identification and authorization claims.
 *
 * @param {Object} user - The user Mongoose document or plain object containing _id, email, and role
 * @returns {string} Signed JWT token string
 */
const generateToken = (user) => {
    // Generate and sign token using user payload, secret key, and configurable expiration duration
    return jwt.sign(
        // Token claims payload
        {
            // Unique MongoDB identifier of the user
            id: user._id,
            // User role string (CUSTOMER, DRIVER, DISPATCHER, ADMIN)
            role: user.role,
            // User primary email address
            email: user.email
        },
        // Secret cryptographic signing key loaded from environment variables
        process.env.JWT_SECRET,
        // Options configuring token lifespan
        {
            // Set expiration window (defaults to 7 days if not defined in .env)
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};

/**
 * Controller: Register a new user account.
 * Validates input parameters, checks for existing email collisions, hashes password with bcrypt,
 * persists the user in MongoDB, and returns an authentication JWT alongside user metadata.
 */
export const register = async (req, res) => {
    try {
        // Extract registration fields from incoming JSON HTTP request body
        const { name, email, password, role } = req.body;

        // Validate presence of all mandatory registration fields
        if (!name || !email || !password) {
            // Return HTTP 400 Bad Request if any required field is missing
            return res.status(400).json({
                // Boolean failure indicator
                success: false,
                // Informative validation error message
                message: "Please provide all required fields: name, email, and password."
            });
        }

        // Validate minimum password length constraint
        if (password.length < 6) {
            // Return HTTP 400 Bad Request if password length is under 6 characters
            return res.status(400).json({
                // Boolean failure indicator
                success: false,
                // Password length error message
                message: "Password must be at least 6 characters long."
            });
        }

        // Sanitize and lowercase email to avoid case-sensitive duplicate registrations
        const normalizedEmail = email.trim().toLowerCase();

        // Check if an existing account is already registered with this email address
        const existingUser = await User.findOne({ email: normalizedEmail });

        // If duplicate email account exists, return conflict error
        if (existingUser) {
            // Return HTTP 409 Conflict status code
            return res.status(409).json({
                // Boolean failure indicator
                success: false,
                // Informative duplicate account error message
                message: "An account with this email address already exists. Please login instead."
            });
        }

        // Generate a cryptographic salt with 10 calculation rounds for secure hashing
        const salt = await bcrypt.genSalt(10);

        // Compute the secure one-way bcrypt hash of the plain-text password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Normalize and validate requested user role against allowed role enum values
        const allowedRoles = ["CUSTOMER", "DRIVER", "DISPATCHER", "ADMIN"];

        // Determine user role (defaults to CUSTOMER if omitted or invalid)
        const userRole = role && allowedRoles.includes(role.toUpperCase())
            ? role.toUpperCase()
            : "CUSTOMER";

        // Create and save the new User document to MongoDB
        const newUser = await User.create({
            // Trimmed user full name
            name: name.trim(),
            // Lowercased, trimmed unique email address
            email: normalizedEmail,
            // Securely hashed password string
            password: hashedPassword,
            // Assigned authorization role
            role: userRole
        });

        // Issue a signed JSON Web Token for the newly created user
        const token = generateToken(newUser);

        // Return HTTP 201 Created status code with user details and authentication token
        return res.status(201).json({
            // Boolean success indicator
            success: true,
            // Confirmation message
            message: "User registered successfully.",
            // Signed authentication token
            token,
            // User payload omitting sensitive password hash
            user: {
                // User MongoDB identifier
                id: newUser._id,
                // User name
                name: newUser.name,
                // User email
                email: newUser.email,
                // User assigned role
                role: newUser.role,
                // Account creation timestamp
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        // Output detailed server error to the terminal console
        console.error("❌ Error in register controller:", error);

        // Return HTTP 500 Internal Server Error response to client
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Generic user-safe error message
            message: "An internal server error occurred during registration. Please try again later.",
            // Detailed technical error message for debugging
            error: error.message
        });
    }
};

/**
 * Controller: Authenticate existing user with credentials and issue a JWT.
 * Verifies email and password against stored bcrypt hash, returns user profile and token.
 */
export const login = async (req, res) => {
    try {
        // Extract credentials from incoming JSON HTTP request body
        const { email, password } = req.body;

        // Verify that both email and password are provided in the request
        if (!email || !password) {
            // Return HTTP 400 Bad Request if either credential field is missing
            return res.status(400).json({
                // Boolean failure indicator
                success: false,
                // Missing credentials error message
                message: "Please provide both email and password to sign in."
            });
        }

        // Normalize input email address
        const normalizedEmail = email.trim().toLowerCase();

        // Search for existing user account with matching email in MongoDB
        const user = await User.findOne({ email: normalizedEmail });

        // If no user document matches the provided email, reject authentication
        if (!user) {
            // Return HTTP 401 Unauthorized for invalid email
            return res.status(401).json({
                // Boolean failure indicator
                success: false,
                // Security-conscious generic credential rejection message
                message: "Invalid email or password credentials."
            });
        }

        // Compare plain-text password with stored bcrypt hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        // If bcrypt comparison fails, reject authentication
        if (!isPasswordMatch) {
            // Return HTTP 401 Unauthorized for password mismatch
            return res.status(401).json({
                // Boolean failure indicator
                success: false,
                // Security-conscious generic credential rejection message
                message: "Invalid email or password credentials."
            });
        }

        // Generate signed JWT authorization token for the authenticated user
        const token = generateToken(user);

        // Return HTTP 200 OK status code with user details and authentication token
        return res.status(200).json({
            // Boolean success indicator
            success: true,
            // Success message
            message: "Login successful.",
            // Signed authentication token
            token,
            // User profile object omitting password hash
            user: {
                // User MongoDB identifier
                id: user._id,
                // User name
                name: user.name,
                // User email
                email: user.email,
                // User role
                role: user.role,
                // Account creation timestamp
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        // Output detailed server error to the terminal console
        console.error("❌ Error in login controller:", error);

        // Return HTTP 500 Internal Server Error response to client
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "An internal server error occurred during login. Please try again later.",
            // Detailed technical error message
            error: error.message
        });
    }
};

/**
 * Controller: Retrieve profile data of currently authenticated user.
 */
export const getProfile = async (req, res) => {
    try {
        // Find user by id stored in req.user by authentication middleware, excluding password field
        const user = await User.findById(req.user.id).select("-password");

        // Verify that user record exists in database
        if (!user) {
            // Return HTTP 404 Not Found if user no longer exists
            return res.status(404).json({
                // Boolean failure indicator
                success: false,
                // Error message
                message: "User profile not found."
            });
        }

        // Return HTTP 200 OK status code with user profile data
        return res.status(200).json({
            // Boolean success indicator
            success: true,
            // User document
            user
        });
    } catch (error) {
        // Output detailed server error to the terminal console
        console.error("❌ Error in getProfile controller:", error);

        // Return HTTP 500 Internal Server Error response
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "Failed to retrieve user profile.",
            // Detailed technical error message
            error: error.message
        });
    }
};

// Export all controller functions as a default object bundle
export default {
    register,
    login,
    getProfile
};
