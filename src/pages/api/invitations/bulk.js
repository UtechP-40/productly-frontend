// /pages/api/invitations/bulk.js
import axios from "axios";

/**
 * API route for bulk invitation creation
 * @route POST /api/invitations/bulk
 * @description Handles bulk invitation creation with email integration
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
      `${NEXT_BACKEND_URL}invitations/bulk`,
      req.body,
      {
        withCredentials: true,
        headers
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Bulk invitations sent successfully"
    });
  } catch (error) {
    console.error("Bulk invitations API error:", error.response?.data || error.message);

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
        message: error.response.data.message || "You don't have permission to send invitations"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to send bulk invitations";

    return res.status(status).json({
      success: false,
      message
    });
  }
}