// Import the Mongoose library to define schemas, subdocuments, and models
import mongoose from "mongoose";

// Define the subdocument schema for tracking history audit trail entries
const trackingHistorySchema = new mongoose.Schema(
    {
        // Status checkpoint code reached at this specific point in time
        status: {
            // Data type is a string
            type: String,
            // Field is required for every history record
            required: [true, "Status is required for tracking log"],
            // Allowed status codes mirroring the master shipment status enum
            enum: [
                "ORDER_CREATED",
                "PICKED_UP",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "EXCEPTION",
                "CANCELLED"
            ]
        },
        // Physical location or facility where this status checkpoint occurred
        location: {
            // Data type is a string
            type: String,
            // Defaults to empty string if location not specified
            default: ""
        },
        // Human-readable description or notes for the tracking event
        description: {
            // Data type is a string
            type: String,
            // Defaults to empty string if description not provided
            default: ""
        },
        // Exact timestamp when this tracking log checkpoint was recorded
        timestamp: {
            // Data type is a Date object
            type: Date,
            // Defaults automatically to current date and time
            default: Date.now
        },
        // Optional reference to the user (e.g., driver or dispatcher) who logged the status update
        updatedBy: {
            // Data type is a MongoDB ObjectId reference
            type: mongoose.Schema.Types.ObjectId,
            // Relates to the User collection in MongoDB
            ref: "User",
            // Optional field
            default: null
        }
    },
    {
        // Disables automatic _id generation for nested tracking history entries to keep payloads clean
        _id: true
    }
);

// Define the primary Shipment schema containing parcel and delivery metadata
const shipmentSchema = new mongoose.Schema(
    {
        // Unique tracking identifier generated upon parcel registration (e.g., ACE-XYZ123)
        trackingNumber: {
            // Data type is a string
            type: String,
            // Mandatory for every shipment
            required: [true, "Tracking number is required"],
            // Enforces uniqueness across all shipments
            unique: true,
            // Ensures tracking number is indexed for high-performance lookup
            index: true,
            // Strips whitespace around tracking number
            trim: true,
            // Automatically converts tracking number to uppercase characters
            uppercase: true
        },
        // Reference to the customer or sender User who initiated the shipment
        sender: {
            // Data type is a MongoDB ObjectId
            type: mongoose.Schema.Types.ObjectId,
            // Relates to the User model
            ref: "User",
            // Sender is mandatory
            required: [true, "Shipment sender reference is required"]
        },
        // Reference to the assigned driver responsible for physical transit and delivery
        assignedDriver: {
            // Data type is a MongoDB ObjectId
            type: mongoose.Schema.Types.ObjectId,
            // Relates to the User model
            ref: "User",
            // Defaults to null until assigned by a dispatcher
            default: null
        },
        // Pickup address and origin location details
        origin: {
            // Full street address of origin pickup point
            address: {
                // Data type is string
                type: String,
                // Origin street address is mandatory
                required: [true, "Origin address is required"],
                // Removes leading/trailing spaces
                trim: true
            },
            // Origin city name
            city: {
                // Data type is string
                type: String,
                // Defaults to empty string
                default: "",
                // Removes leading/trailing spaces
                trim: true
            },
            // Origin state or province
            state: {
                // Data type is string
                type: String,
                // Defaults to empty string
                default: "",
                // Removes leading/trailing spaces
                trim: true
            },
            // Origin country name or ISO country code
            country: {
                // Data type is string
                type: String,
                // Defaults to USA or global default
                default: "USA",
                // Removes leading/trailing spaces
                trim: true
            },
            // Origin postal / zip code
            postalCode: {
                // Data type is string
                type: String,
                // Defaults to empty string
                default: "",
                // Removes leading/trailing spaces
                trim: true
            }
        },
        // Final destination address and drop-off location details
        destination: {
            // Full street address of delivery destination
            address: {
                // Data type is string
                type: String,
                // Destination street address is mandatory
                required: [true, "Destination address is required"],
                // Removes leading/trailing spaces
                trim: true
            },
            // Destination city name
            city: {
                // Data type is string
                type: String,
                // Defaults to empty string
                default: "",
                // Removes leading/trailing spaces
                trim: true
            },
            // Destination state or province
            state: {
                // Data type is string
                type: String,
                // Defaults to empty string
                default: "",
                // Removes leading/trailing spaces
                trim: true
            },
            // Destination country name or ISO country code
            country: {
                // Data type is string
                type: String,
                // Defaults to USA or destination country
                default: "USA",
                // Removes leading/trailing spaces
                trim: true
            },
            // Destination postal / zip code
            postalCode: {
                // Data type is string
                type: String,
                // Defaults to empty string
                default: "",
                // Removes leading/trailing spaces
                trim: true
            }
        },
        // Current operational status of the shipment in transit
        currentStatus: {
            // Data type is a string
            type: String,
            // Restricts status to approved enumerated delivery states
            enum: {
                // Supported status codes
                values: [
                    "ORDER_CREATED",
                    "PICKED_UP",
                    "IN_TRANSIT",
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                    "EXCEPTION",
                    "CANCELLED"
                ],
                // Error message when an unrecognized status is provided
                message: "{VALUE} is not a valid shipment status"
            },
            // Initial default status assigned when shipment is first booked
            default: "ORDER_CREATED"
        },
        // Array of chronological tracking history logs updated via $push operations
        trackingHistory: {
            // Uses the trackingHistorySchema subdocument definition
            type: [trackingHistorySchema],
            // Initializes to an empty array upon document creation
            default: []
        },
        // Metadata describing package specifications (weight, dimensions, cargo type)
        packageDetails: {
            // Weight of the package in kilograms
            weightKg: {
                // Numeric weight value
                type: Number,
                // Minimum weight must be positive
                min: [0, "Weight cannot be negative"],
                // Default fallback weight
                default: 1.0
            },
            // Category or description of items being shipped (e.g., Electronics, Documents)
            category: {
                // Data type is string
                type: String,
                // Defaults to General Goods
                default: "General Freight"
            },
            // Estimated delivery date calculated at booking time
            estimatedDelivery: {
                // Data type is Date
                type: Date,
                // Optional default null
                default: null
            }
        }
    },
    {
        // Automatically injects createdAt and updatedAt ISO timestamp fields
        timestamps: true
    }
);

// Compile the Mongoose model from the schema or reuse existing compiled model
const Shipment = mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema);

// Export the Shipment model as the default ES module export
export default Shipment;
