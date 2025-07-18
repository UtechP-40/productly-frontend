// /pages/api/roles/[id].js
import axios from "axios";

/**
 * API route for role management by ID
 * @route GET /api/roles/[id] - Get a specific role
 * @route PUT /api/roles/[id] - Update a role
 * @route DELETE /api/roles/[id] - Delete a role
 * @description Handles operations on a specific role
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
    // Handle GET request - Get role by ID
    if (req.method === "GET") {
      const response = await axios.get(
        `${NEXT_BACKEND_URL}roles/${id}`,
        {
          withCredentials: true,
          headers
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Role retrieved successfully"
      });
    }
    
    // Handle PUT request - Update role
    else if (req.method === "PUT") {
      const response = await axios.put(
        `${NEXT_BACKEND_URL}roles/${id}`,
        req.body,
        {
          withCredentials: true,
          headers
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Role updated successfully"
      });
    }
    
    // Handle DELETE request - Delete role
    else if (req.method === "DELETE") {
      const response = await axios.delete(
        `${NEXT_BACKEND_URL}roles/${id}`,
        {
          withCredentials: true,
          headers
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Role deleted successfully"
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
    console.error(`Roles API error for ID ${id}:`, error.response?.data || error.message);

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