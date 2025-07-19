// /pages/api/users/[userId]/status.js
import axios from "axios";

/**
 * API route for updating user status
 * @route PATCH /api/users/[userId]/status - Update user status (active/inactive)
 * @access Private (requires authentication)
 */
export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
  const { cookies } = req;
  const { userId } = req.query;
  const { organizationId, status } = req.body;
  
  // Check for authentication
  if (!cookies.accessToken || !cookies.sessionToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Check for required parameters
  if (!userId || !organizationId || !status) {
    return res.status(400).json({
      success: false,
      message: "User ID, organization ID and status are required"
    });
  }

  // Set up headers with cookies for authentication
  const headers = {
    Cookie: Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")
  };

  try {
    const response = await axios.patch(
      `${NEXT_BACKEND_URL}users/${userId}/status`,
      { organizationId, status },
      {
        withCredentials: true,
        headers
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "User status updated successfully"
    });
  } catch (error) {
    console.error("Update user status API error:", error.response?.data || error.message);

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
        message: error.response.data.message || "You don't have permission to update user status"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to update user status";

    return res.status(status).json({
      success: false,
      message
    });
  }
}