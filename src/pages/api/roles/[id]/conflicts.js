// /pages/api/roles/[id]/conflicts.js

import axios from "axios";

/**
 * API route for checking role conflicts
 * @route GET /api/roles/[id]/conflicts
 * @description Checks for permission conflicts between this role and other roles
 * @access Private (requires authentication)
 */
export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Role ID is required"
      });
    }

    // Forward cookies for authentication
    const cookies = req.headers.cookie || "";

    // Make request to backend API
    const response = await axios.get(
      `${process.env.BACKEND_API_URL}/roles/${id}/conflicts`,
      {
        headers: {
          Cookie: cookies
        },
        withCredentials: true
      }
    );

    // Return successful response
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Role conflicts checked successfully"
    });
  } catch (error) {
    console.error("Role conflicts API error:", error.response?.data || error.message);

    // Handle token expiration
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Handle forbidden access
    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: error.response.data.message || "You don't have permission to check role conflicts"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to check role conflicts";

    return res.status(status).json({
      success: false,
      message
    });
  }
}