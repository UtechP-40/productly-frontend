// /pages/api/invitations/[id]/revoke.js
import axios from "axios";

/**
 * API route for revoking invitations
 * @route POST /api/invitations/[id]/revoke
 * @description Revokes an invitation
 * @access Private (requires authentication)
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

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
    const response = await axios.post(
      `${NEXT_BACKEND_URL}invitations/${id}/revoke`,
      {},
      {
        withCredentials: true,
        headers
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Invitation revoked successfully"
    });
  } catch (error) {
    console.error(`Revoke invitation API error for ID ${id}:`, error.response?.data || error.message);

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
        message: error.response.data.message || "You don't have permission to revoke invitations"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to revoke invitation";

    return res.status(status).json({
      success: false,
      message
    });
  }
}