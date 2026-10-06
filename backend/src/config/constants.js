// Primary MongoDB database name for the ACE Logistics platform
export const DB_NAME = "ace_logistics";

// Standard application role constants for consistent role checks
export const ROLES = {
    // Standard customer role
    CUSTOMER: "CUSTOMER",
    // Transit driver role
    DRIVER: "DRIVER",
    // Dispatch manager role
    DISPATCHER: "DISPATCHER",
    // System administrator role
    ADMIN: "ADMIN"
};

// Standard shipment transit status checkpoint constants
export const SHIPMENT_STATUS = {
    // Initial order creation
    ORDER_CREATED: "ORDER_CREATED",
    // Driver pickup from origin
    PICKED_UP: "PICKED_UP",
    // In transit between logistics hubs
    IN_TRANSIT: "IN_TRANSIT",
    // Loaded on local delivery vehicle
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    // Successfully delivered to recipient
    DELIVERED: "DELIVERED",
    // Transit exception or delay
    EXCEPTION: "EXCEPTION",
    // Order cancelled
    CANCELLED: "CANCELLED"
};