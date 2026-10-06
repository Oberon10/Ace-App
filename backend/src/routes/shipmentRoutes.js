// Import Router from Express to declare modular shipment route definitions
import { Router } from "express";

// Import shipment controller functions handling business logic
import {
    createShipment,
    updateShipmentStatus,
    getShipmentByTrackingNumber,
    getAllShipments,
    getShipmentById
} from "../controllers/shipmentController.js";

// Import authentication and authorization middleware functions
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

// Instantiate a new Express router for shipment operations
const router = Router();

/**
 * @route   GET /api/shipments/track/:trackingNumber
 * @desc    Public tracking endpoint to lookup shipment progress by tracking number
 * @access  Public (No authentication token required)
 */
router.get(
    // URL path parameter capture for tracking number string
    "/track/:trackingNumber",
    // Controller handler retrieving shipment tracking logs and current state
    getShipmentByTrackingNumber
);

/**
 * @route   POST /api/shipments
 * @desc    Create a new shipment booking with auto-generated tracking code
 * @access  Private (CUSTOMER, DISPATCHER, or ADMIN)
 */
router.post(
    // Base URL route for creating a shipment
    "/",
    // Verify JWT authentication token
    authenticateToken,
    // Restrict access to Customer, Dispatcher, and Admin roles
    authorizeRoles("CUSTOMER", "DISPATCHER", "ADMIN"),
    // Controller creating shipment and generating tracking record
    createShipment
);

/**
 * @route   PATCH /api/shipments/:id/status
 * @desc    Update current operational status and push new tracking checkpoint log
 * @access  Private (DRIVER, DISPATCHER, or ADMIN)
 */
router.patch(
    // URL path capture for shipment ID or tracking number
    "/:id/status",
    // Verify JWT authentication token
    authenticateToken,
    // Restrict access to operational roles responsible for transit updates
    authorizeRoles("DRIVER", "DISPATCHER", "ADMIN"),
    // Controller updating status and pushing log via MongoDB $push
    updateShipmentStatus
);

/**
 * @route   GET /api/shipments
 * @desc    Retrieve shipment list (scoped to user's shipments or full list for ops)
 * @access  Private (Authenticated users)
 */
router.get(
    // Base URL route to fetch list of shipments
    "/",
    // Verify JWT authentication token
    authenticateToken,
    // Controller retrieving scoped shipments list
    getAllShipments
);

/**
 * @route   GET /api/shipments/:id
 * @desc    Retrieve detailed shipment record by MongoDB ObjectId
 * @access  Private (Authenticated users)
 */
router.get(
    // URL path capture for MongoDB document identifier
    "/:id",
    // Verify JWT authentication token
    authenticateToken,
    // Controller returning complete shipment document
    getShipmentById
);

// Export router instance as the default ES module export
export default router;
