// Import the Express web framework
import express from "express";

// Import CORS middleware to enable Cross-Origin Resource Sharing
import cors from "cors";

// Import Helmet middleware to secure Express apps by setting various HTTP response headers
import helmet from "helmet";

// Import dotenv to load environment variables from the .env configuration file
import dotenv from "dotenv";

// Import the database connection utility function
import connectDB from "./config/database.js";

// Import authentication route endpoints
import authRoutes from "./routes/authRoutes.js";

// Import shipment route endpoints
import shipmentRoutes from "./routes/shipmentRoutes.js";

// Initialize environment configuration from local .env file
dotenv.config();

// Create the core Express application instance
const app = express();

// Base starting port from environment or fallback to 5000
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

// Maximum port search range offset (checks up to DEFAULT_PORT + PORT_RANGE, e.g. 5000 - 5020)
const PORT_RANGE = parseInt(process.env.PORT_RANGE, 10) || 20;

// Upper bound port limit to test (customizable via MAX_PORT or defaults to DEFAULT_PORT + PORT_RANGE)
const MAX_PORT = parseInt(process.env.MAX_PORT, 10) || (DEFAULT_PORT + PORT_RANGE);

// Apply Helmet security middleware to mitigate common web security vulnerabilities
app.use(helmet());

// Configure allowed frontend origins for Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
    // Client URL defined in .env (e.g., https://ace-app-dusky.vercel.app)
    process.env.CLIENT_URL,
    // Production Vercel deployment URL
    "https://ace-app-dusky.vercel.app",
    // Local Vite development server
    "http://localhost:5173",
    // Standard alternative local development server
    "http://localhost:3000"
].filter(Boolean);

// Apply CORS middleware with explicit origin matching, credentials, and allowed HTTP methods
app.use(
    cors({
        // Origin validation function checking incoming request Origin header
        origin: (origin, callback) => {
            // Allow server-to-server requests or matching client origin domains
            if (!origin || allowedOrigins.includes(origin)) {
                // Accept cross-origin request
                callback(null, true);
            } else {
                // Accept request for developer convenience
                callback(null, true);
            }
        },
        // Allow cookies and authorization credentials in cross-origin requests
        credentials: true,
        // Supported HTTP methods
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        // Permitted headers in incoming HTTP requests
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Express JSON body parser middleware to parse incoming request payloads up to 16kb
app.use(express.json({ limit: "16kb" }));

// Express URL-encoded body parser middleware to parse form-encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Root health check endpoint for deployment probes and connectivity verification
app.get("/", (req, res) => {
    // Return HTTP 200 OK JSON status response confirming API server is running
    res.status(200).json({
        // Success boolean
        success: true,
        // Server message
        message: "ACE Logistics Backend API is operational.",
        // Current server timestamp
        timestamp: new Date().toISOString()
    });
});

// Dedicated health endpoint providing system status information
app.get("/health", (req, res) => {
    // Return HTTP 200 OK health status
    res.status(200).json({
        // Status string
        status: "UP",
        // Service name
        service: "ACE Logistics API",
        // System uptime in seconds
        uptime: process.uptime()
    });
});

// Mount user authentication routes at /api/auth
app.use("/api/auth", authRoutes);

// Mount logistics shipment routes at /api/shipments
app.use("/api/shipments", shipmentRoutes);

// Catch-all 404 handler for undefined API routes
app.use((req, res, next) => {
    // Return HTTP 404 Not Found response
    res.status(404).json({
        // Boolean failure indicator
        success: false,
        // Error message indicating requested path does not exist on this server
        message: `Route '${req.originalUrl}' not found on ACE Logistics API.`
    });
});

// Global central error-handling middleware catching all unhandled application errors
app.use((err, req, res, next) => {
    // Log the error details to the server terminal console
    console.error("❌ Unhandled Application Error:", err);

    // Return HTTP 500 or existing error status code with helpful debug payload
    res.status(err.statusCode || 500).json({
        // Boolean failure indicator
        success: false,
        // Error message
        message: err.message || "An unexpected internal server error occurred.",
        // Include stack trace only when running outside production environment
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
});

/**
 * Starts the HTTP server on an available port within the specified range.
 * If the target port is blocked or in use (EADDRINUSE), it automatically cycles
 * to the next port until a free port is found or the range is exhausted.
 *
 * @param {number} currentPort - Starting port to attempt binding to.
 * @param {number} maxPort - Upper limit of the port range to search.
 * @returns {Promise<import("http").Server>}
 */
const listenWithPortFallback = (currentPort, maxPort) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(currentPort);

        server.on("listening", () => {
            const address = server.address();
            const activePort = typeof address === "object" && address ? address.port : currentPort;

            // Update app locals and environment variable with the active port
            app.set("port", activePort);
            process.env.PORT = String(activePort);

            // Log successful server boot confirmation message to console
            console.log(`🚀 ACE Logistics Server running successfully on port ${activePort}`);
            // Log active API URL for developer convenience
            console.log(`🌐 Base API URL: http://localhost:${activePort}`);

            resolve(server);
        });

        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.warn(`⚠️ Port ${currentPort} is currently blocked or already in use.`);
                if (currentPort < maxPort) {
                    const nextPort = currentPort + 1;
                    console.log(`🔄 Automatically trying next available port in range: ${nextPort}...`);
                    listenWithPortFallback(nextPort, maxPort).then(resolve).catch(reject);
                } else {
                    const errorMsg = `❌ No available ports found in range ${DEFAULT_PORT} to ${maxPort}. Please free up a port or increase PORT_RANGE.`;
                    console.error(errorMsg);
                    reject(new Error(errorMsg));
                }
            } else {
                console.error("❌ Fatal server startup error:", err);
                reject(err);
            }
        });
    });
};

/**
 * Bootstrap function: Connects to MongoDB database and starts the HTTP server.
 */
const startServer = async () => {
    try {
        // Connect to MongoDB Atlas cluster using Mongoose with try/catch safety
        await connectDB();
    } catch (error) {
        // Log startup failure warning to console without crashing HTTP server
        console.warn("⚠️ Initial database connection warning:", error.message);
    }

    try {
        // Start listening with automatic fallback across the configured port range
        await listenWithPortFallback(DEFAULT_PORT, MAX_PORT);
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
    }
};

// Execute bootstrap startup process
startServer();

// Export the Express app instance for testing and external server configurations
export default app;