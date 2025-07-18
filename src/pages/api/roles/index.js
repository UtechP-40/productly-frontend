// /pages/api/roles/index.js
import axios from "axios";

/**
 * API route for role management
 * @route GET /api/roles - Get all roles
 * @route POST /api/roles - Create a new role
 * @description Handles role listing and creation
 * @access Private (requires authentication)
 */
export default async function handler(req, res) {
  const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
  const { cookies } = req;
  
  // Check for authentication
  if (!cookies.accessToken || !cookies.sessionToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Set up headers with cookies for authentication
  const headers = {
    Cookie: Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")
  };

  try {
    // Handle GET request - List roles
    if (req.method === "GET") {
      const response = await axios.get(
        `${NEXT_BACKEND_URL}roles`,
        {
          withCredentials: true,
          headers,
          params: req.query // Forward any query parameters
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Roles retrieved successfully"
      });
    }
    
    // Handle POST request - Create role
    else if (req.method === "POST") {
      const response = await axios.post(
        `${NEXT_BACKEND_URL}roles`,
        req.body,
        {
          withCredentials: true,
          headers
        }
      );

      return res.status(201).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Role created successfully"
      });
    }
    
    // Handle unsupported methods
    else {
      return res.status(405).json({
        success: false,
        message: "Method not allowed"
      });
    }
  } catch (error) {
    console.error("Roles API error:", error.response?.data || error.message);

    // Handle token expiration
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
        code: "TOKEN_EXPIRED"
      });
    }

    // Handle permission errors
    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: error.response.data.message || "You don't have permission to perform this action"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Role operation failed";

    return res.status(status).json({
      success: false,
      message
    });
  }
}