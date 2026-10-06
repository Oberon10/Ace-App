// Import the Mongoose Shipment data model
import Shipment from "../models/Shipment.js";

/**
 * Utility helper function to generate a unique, human-readable logistics tracking number.
 * Format: ACE-XXXXXX-YYYY (e.g., ACE-M1X8PQ-7294)
 *
 * @returns {string} Unique uppercase tracking number
 */
const generateTrackingNumber = () => {
    // Generate timestamp component converted to base-36 alphanumeric string
    const timestampPart = Date.now().toString(36).toUpperCase();

    // Generate random 4-digit numeric code
    const randomPart = Math.floor(1000 + Math.random() * 9000);

    // Combine prefix and random fragments into standardized ACE tracking format
    return `ACE-${timestampPart}-${randomPart}`;
};

/**
 * Controller: Create a new logistics shipment.
 * Automatically generates a unique tracking number, populates the sender reference,
 * initializes the currentStatus to 'ORDER_CREATED', and appends the initial tracking history log.
 */
export const createShipment = async (req, res) => {
    try {
        // Extract shipment payload fields from incoming HTTP request body
        const { origin, destination, packageDetails, assignedDriver, sender } = req.body;

        // Validate presence of origin information and address string
        if (!origin || !origin.address) {
            // Return HTTP 400 Bad Request if origin address is missing
            return res.status(400).json({
                // Boolean failure indicator
                success: false,
                // Error description
                message: "Origin address is required."
            });
        }

        // Validate presence of destination information and address string
        if (!destination || !destination.address) {
            // Return HTTP 400 Bad Request if destination address is missing
            return res.status(400).json({
                // Boolean failure indicator
                success: false,
                // Error description
                message: "Destination address is required."
            });
        }

        // Determine sender user ID (dispatchers/admins can specify custom sender, otherwise logged-in user)
        const senderId = (req.user.role === "ADMIN" || req.user.role === "DISPATCHER") && sender
            ? sender
            : req.user.id;

        // Generate a new unique tracking identifier for this shipment
        const trackingNumber = generateTrackingNumber();

        // Construct the initial tracking audit trail history entry
        const initialTrackingLog = {
            // Initial shipment status code
            status: "ORDER_CREATED",
            // Location set to origin city or origin address
            location: origin.city || origin.address || "Origin Hub",
            // Description of initial event
            description: "Shipment order created and registered in the ACE logistics system.",
            // Checkpoint creation timestamp
            timestamp: new Date(),
            // User reference of whoever initiated the shipment order
            updatedBy: req.user.id
        };

        // Persist the new shipment document in MongoDB collection
        const newShipment = await Shipment.create({
            // Generated unique tracking identifier
            trackingNumber,
            // User identifier of parcel sender
            sender: senderId,
            // Assigned driver identifier (null if not yet dispatched)
            assignedDriver: assignedDriver || null,
            // Origin details object
            origin,
            // Destination details object
            destination,
            // Initial operational status
            currentStatus: "ORDER_CREATED",
            // Initial array containing the first history log entry
            trackingHistory: [initialTrackingLog],
            // Package weight, category, and delivery estimates
            packageDetails: packageDetails || {}
        });

        // Return HTTP 201 Created status code along with the created shipment
        return res.status(201).json({
            // Boolean success indicator
            success: true,
            // Confirmation message
            message: "Shipment created successfully.",
            // Created shipment document
            shipment: newShipment
        });
    } catch (error) {
        // Output detailed server error to console
        console.error("❌ Error in createShipment controller:", error);

        // Return HTTP 500 Internal Server Error response
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "Failed to create shipment. Please verify shipment data.",
            // Detailed technical error message
            error: error.message
        });
    }
};

/**
 * Controller: Update the status of an existing shipment.
 * Uses MongoDB $set to update currentStatus and $push to append a new audit log
 * into the trackingHistory array.
 */
export const updateShipmentStatus = async (req, res) => {
    try {
        // Extract shipment identifier from URL request route parameters
        const { id } = req.params;

        // Extract status update fields from incoming HTTP request body
        const { status, location, description } = req.body;

        // List of permitted shipment status enum values
        const allowedStatuses = [
            "ORDER_CREATED",
            "PICKED_UP",
            "IN_TRANSIT",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "EXCEPTION",
            "CANCELLED"
        ];

        // Validate that status parameter is provided and exists in allowedStatuses array
        if (!status || !allowedStatuses.includes(status)) {
            // Return HTTP 400 Bad Request for unrecognized status code
            return res.status(400).json({
                // Boolean failure indicator
                success: false,
                // Error message with list of allowed statuses
                message: `Invalid status. Allowed values: [${allowedStatuses.join(", ")}].`
            });
        }

        // Construct new tracking history audit log object
        const newHistoryLog = {
            // New operational status
            status,
            // Physical location where checkpoint occurred
            location: location || "Transit Hub",
            // Explanatory note or automated description
            description: description || `Shipment status updated to ${status}.`,
            // Timestamp of the status change event
            timestamp: new Date(),
            // Reference to authenticated user who updated the status
            updatedBy: req.user.id
        };

        // Determine query filter: support MongoDB _id or trackingNumber
        const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { trackingNumber: id.toUpperCase() };

        // Execute atomic update: $set new currentStatus and $push new history entry
        const updatedShipment = await Shipment.findOneAndUpdate(
            // Query filter identifying the target shipment document
            filter,
            // MongoDB atomic update operations
            {
                // Update currentStatus field to the new status
                $set: { currentStatus: status },
                // Push the new history log entry into trackingHistory array
                $push: { trackingHistory: newHistoryLog }
            },
            // Options: return updated document and run Mongoose schema validators
            {
                // Return document after update has been applied
                new: true,
                // Validate modified fields against schema rules
                runValidators: true
            }
        ).populate("sender", "name email").populate("assignedDriver", "name email");

        // Verify that shipment document was located and updated
        if (!updatedShipment) {
            // Return HTTP 404 Not Found if shipment does not exist
            return res.status(404).json({
                // Boolean failure indicator
                success: false,
                // Error message
                message: `Shipment with identifier '${id}' not found.`
            });
        }

        // Return HTTP 200 OK status code with updated shipment document
        return res.status(200).json({
            // Boolean success indicator
            success: true,
            // Confirmation message
            message: "Shipment status updated successfully.",
            // Updated shipment document
            shipment: updatedShipment
        });
    } catch (error) {
        // Output detailed server error to console
        console.error("❌ Error in updateShipmentStatus controller:", error);

        // Return HTTP 500 Internal Server Error response
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "Failed to update shipment status.",
            // Detailed technical error message
            error: error.message
        });
    }
};

/**
 * Controller: Retrieve shipment details by tracking number.
 * Public endpoint enabling customers to track parcels without mandatory authentication.
 */
export const getShipmentByTrackingNumber = async (req, res) => {
    try {
        // Extract tracking number parameter from URL route
        const { trackingNumber } = req.params;

        // Search for shipment in MongoDB matching normalized tracking number
        const shipment = await Shipment.findOne({
            // Case-insensitive uppercase search
            trackingNumber: trackingNumber.trim().toUpperCase()
        })
            .populate("sender", "name email")
            .populate("assignedDriver", "name email");

        // Check if matching shipment was found
        if (!shipment) {
            // Return HTTP 404 Not Found if tracking number does not exist
            return res.status(404).json({
                // Boolean failure indicator
                success: false,
                // Error message
                message: `No shipment found matching tracking number '${trackingNumber}'.`
            });
        }

        // Return HTTP 200 OK status code with shipment tracking information
        return res.status(200).json({
            // Boolean success indicator
            success: true,
            // Shipment document
            shipment
        });
    } catch (error) {
        // Output detailed server error to console
        console.error("❌ Error in getShipmentByTrackingNumber controller:", error);

        // Return HTTP 500 Internal Server Error response
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "Error retrieving shipment tracking details.",
            // Detailed technical error message
            error: error.message
        });
    }
};

/**
 * Controller: Retrieve all shipments with role-aware scoping.
 * Customers receive only their own shipments; Admin/Dispatcher/Drivers receive all or assigned.
 */
export const getAllShipments = async (req, res) => {
    try {
        // Initialize query filter object
        let queryFilter = {};

        // Restrict customers to only view shipments where they are the sender
        if (req.user.role === "CUSTOMER") {
            // Match sender ObjectId to authenticated user id
            queryFilter.sender = req.user.id;
        } else if (req.user.role === "DRIVER") {
            // Restrict drivers to shipments assigned to them
            queryFilter.assignedDriver = req.user.id;
        }

        // Query shipments collection applying filter and sorting newest first
        const shipments = await Shipment.find(queryFilter)
            .sort({ createdAt: -1 })
            .populate("sender", "name email")
            .populate("assignedDriver", "name email");

        // Return HTTP 200 OK status code with array of shipments
        return res.status(200).json({
            // Boolean success indicator
            success: true,
            // Total number of matched records
            count: shipments.length,
            // Array of shipment documents
            shipments
        });
    } catch (error) {
        // Output detailed server error to console
        console.error("❌ Error in getAllShipments controller:", error);

        // Return HTTP 500 Internal Server Error response
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "Failed to retrieve shipments.",
            // Detailed technical error message
            error: error.message
        });
    }
};

/**
 * Controller: Retrieve single shipment by its MongoDB ObjectId.
 */
export const getShipmentById = async (req, res) => {
    try {
        // Extract shipment ID parameter from request URL
        const { id } = req.params;

        // Query shipment by MongoDB ObjectId with populated sender and driver
        const shipment = await Shipment.findById(id)
            .populate("sender", "name email")
            .populate("assignedDriver", "name email");

        // Check if shipment exists
        if (!shipment) {
            // Return HTTP 404 Not Found if record not present
            return res.status(404).json({
                // Boolean failure indicator
                success: false,
                // Error message
                message: "Shipment not found."
            });
        }

        // Return HTTP 200 OK status code with shipment details
        return res.status(200).json({
            // Boolean success indicator
            success: true,
            // Shipment document
            shipment
        });
    } catch (error) {
        // Output detailed server error to console
        console.error("❌ Error in getShipmentById controller:", error);

        // Return HTTP 500 Internal Server Error response
        return res.status(500).json({
            // Boolean failure indicator
            success: false,
            // Error message
            message: "Failed to retrieve shipment details.",
            // Detailed technical error message
            error: error.message
        });
    }
};

// Export all controller functions as a default object bundle
export default {
    createShipment,
    updateShipmentStatus,
    getShipmentByTrackingNumber,
    getAllShipments,
    getShipmentById
};
