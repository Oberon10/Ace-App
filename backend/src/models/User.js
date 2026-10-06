// Import the Mongoose library to create schemas and models
import mongoose from "mongoose";

// Define the User schema specifying structure, types, constraints, and validation rules
const userSchema = new mongoose.Schema(
    {
        // Full name of the user (e.g., John Doe)
        name: {
            // Data type must be a string
            type: String,
            // Field is mandatory for every user record
            required: [true, "Name is required"],
            // Strips any leading or trailing whitespace from the entered name
            trim: true,
            // Enforces minimum length constraint of 2 characters
            minlength: [2, "Name must be at least 2 characters long"],
            // Enforces maximum length constraint of 100 characters
            maxlength: [100, "Name cannot exceed 100 characters"]
        },
        // Unique email address used as the primary login credential
        email: {
            // Data type must be a string
            type: String,
            // Field is mandatory
            required: [true, "Email address is required"],
            // Enforces uniqueness across the MongoDB users collection with an index
            unique: true,
            // Automatically converts the email to lowercase before storing
            lowercase: true,
            // Strips whitespace around the email
            trim: true,
            // Validates email format using standard regular expression pattern
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                "Please provide a valid email address"
            ]
        },
        // Hashed password string (bcrypt hashed before persistence)
        password: {
            // Data type must be a string
            type: String,
            // Field is mandatory
            required: [true, "Password is required"],
            // Requires minimum of 6 characters for security
            minlength: [6, "Password must be at least 6 characters long"]
        },
        // Role of the user determining access privileges across the logistics platform
        role: {
            // Data type must be a string
            type: String,
            // Restricts role to one of the four predefined platform roles
            enum: {
                // Array of allowed role values
                values: ["CUSTOMER", "DRIVER", "DISPATCHER", "ADMIN"],
                // Error message displayed when an invalid role is provided
                message: "Role must be either CUSTOMER, DRIVER, DISPATCHER, or ADMIN"
            },
            // Defaults to standard customer role if not explicitly provided during registration
            default: "CUSTOMER"
        }
    },
    {
        // Automatically injects createdAt and updatedAt ISO timestamp fields into each document
        timestamps: true
    }
);

// Create the Mongoose model from the schema or reuse existing model if already compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Export the User model as the default ES module export
export default User;
