// /pages/api/roles/[id]/permissions.js
import axios from "axios";

/**
 * API route for managing role permissions
 * @route POST /api/roles/[id]/permissions - Assign permissions to a role
 * @route DELETE /api/roles/[id]/permissions - Remove permissions from a role
 * @description Handles permission assignment and removal for a specific role
 * @access Private (requires authentication)
 */
export default async function handler(req, res) {
  const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
  const { cookies } = req;
  const { id } = req.query;
  
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
    // Handle POST request - Assign permissions to role
    if (req.method === "POST") {
      const response = await axios.post(
        `${NEXT_BACKEND_URL}roles/${id}/permissions`,
        req.body,
        {
          withCredentials: true,
          headers
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Permissions assigned successfully"
      });
    }
    
    // Handle DELETE request - Remove permissions from role
    else if (req.method === "DELETE") {
      const response = await axios.delete(
        `${NEXT_BACKEND_URL}roles/${id}/permissions`,
        {
          withCredentials: true,
          headers,
          data: req.body // Send request body with DELETE
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Permissions removed successfully"
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
    console.error(`Role permissions API error for ID ${id}:`, error.response?.data || error.message);

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
        message: error.response.data.message || "You don't have permission to manage role permissions"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Permission operation failed";

    return res.status(status).json({
      success: false,
      message
    });
  }
}