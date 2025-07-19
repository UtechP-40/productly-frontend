// /pages/api/users/index.js
import axios from "axios";

/**
 * API route for user management
 * @route GET /api/users - Get all users with their roles
 * @access Private (requires authentication)
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
  const { cookies } = req;
  const { organizationId, page, limit, search, status, role } = req.query;
  
  // Check for authentication
  if (!cookies.accessToken || !cookies.sessionToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Check for required parameters
  if (!organizationId) {
    return res.status(400).json({
      success: false,
      message: "Organization ID is required"
    });
  }

  // Set up headers with cookies for authentication
  const headers = {
    Cookie: Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")
  };

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (role) queryParams.append("role", role);

    const response = await axios.get(
      `${NEXT_BACKEND_URL}users/${organizationId}?${queryParams.toString()}`,
      {
        withCredentials: true,
        headers
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Users fetched successfully"
    });
  } catch (error) {
    console.error("Get users API error:", error.response?.data || error.message);

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
        message: error.response.data.message || "You don't have permission to view users"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to fetch users";

    return res.status(status).json({
      success: false,
      message
    });
  }
}