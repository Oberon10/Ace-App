// Import the Mongoose ODM library to interact with MongoDB
import mongoose from "mongoose";

// Disable command buffering so operations fail fast if DB is disconnected rather than hanging
mongoose.set("bufferCommands", false);

/**
 * Check if the MongoDB connection is currently ready and active.
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 * @returns {boolean}
 */
export const isDatabaseConnected = () => {
    return mongoose.connection.readyState === 1;
};

let retryTimer = null;

/**
 * Asynchronous function to establish a connection to the MongoDB database.
 * Uses Mongoose connect method wrapped inside a try/catch block for resilient error handling.
 */
const connectDB = async () => {
    try {
        // Retrieve the MongoDB connection URI string from the environment variables
        const mongoUri = process.env.MONGODB_URI;

        // Validate that the connection string is provided before attempting to connect
        if (!mongoUri) {
            console.warn("⚠️ MONGODB_URI environment variable is not defined in .env file. Running with local fallback store.");
            return null;
        }

        // Establish the connection using Mongoose with a fast 3000ms server selection timeout
        const connectionInstance = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 5000,
            family: 4
        });

        // Log a helpful confirmation message containing the connected database host name
        console.log(`\n✅ MongoDB connected successfully! Host: ${connectionInstance.connection.host}`);

        if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
        }

        return connectionInstance;
    } catch (error) {
        // Output detailed connection failure details to the server console for debugging
        console.warn("⚠️ MongoDB connection notice:", error.message || error);
        console.warn("💡 Tip: Ensure your MongoDB Atlas IP access list includes your IP (or 0.0.0.0/0).");
        console.log("ℹ️ ACE Logistics backend is running in resilient high-availability mode with in-memory persistence fallback.");

        // Schedule periodic background retry without blocking server execution
        if (!retryTimer) {
            retryTimer = setInterval(async () => {
                if (!isDatabaseConnected() && process.env.MONGODB_URI) {
                    try {
                        await mongoose.connect(process.env.MONGODB_URI, {
                            serverSelectionTimeoutMS: 3000,
                            socketTimeoutMS: 5000,
                            family: 4
                        });
                        console.log("\n✅ Reconnected to MongoDB Atlas in background!");
                        clearInterval(retryTimer);
                        retryTimer = null;
                    } catch {
                        // Silent retry in background
                    }
                }
            }, 60000);
        }

        return null;
    }
};

// Export the connectDB function as default export
export default connectDB;