// Import the Mongoose ODM library to interact with MongoDB
import mongoose from "mongoose";

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
            // Throw an explicit configuration error if the connection string is missing
            throw new Error("MONGODB_URI environment variable is not defined in .env file.");
        }

        // Establish the connection using Mongoose with a 5000ms server selection timeout
        const connectionInstance = await mongoose.connect(mongoUri, {
            // How long Mongoose will wait to connect before failing
            serverSelectionTimeoutMS: 5000
        });

        // Log a helpful confirmation message containing the connected database host name
        console.log(`\n✅ MongoDB connected successfully! Host: ${connectionInstance.connection.host}`);

        // Return the active connection instance for potential downstream access
        return connectionInstance;
    } catch (error) {
        // Output detailed connection failure details to the server console for debugging
        console.error("❌ MongoDB connection error:", error.message || error);
        // Print helpful reminder regarding Atlas credentials or IP whitelist
        console.warn("💡 Tip: Ensure your MongoDB Atlas username, password, and IP access list (0.0.0.0/0) are correctly configured in backend/.env.");

        // Return null instead of terminating process so Express server continues running
        return null;
    }
};

// Export the connectDB function as default export so it can be imported in app.js
export default connectDB;