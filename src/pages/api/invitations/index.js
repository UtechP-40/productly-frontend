// /pages/api/invitations/index.js
import axios from "axios";

/**
 * API route for invitation management
 * @route POST /api/invitations - Create a new invitation
 * @description Handles invitation creation with email integration
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
    // Handle POST request - Create invitation
    if (req.method === "POST") {
      const response = await axios.post(
        `${NEXT_BACKEND_URL}invitations`,
        req.body,
        {
          withCredentials: true,
          headers
        }
      );

      return res.status(201).json({
        success: true,
        data: response.data.data,
        message: response.data.message || "Invitation sent successfully"
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
    console.error("Invitations API error:", error.response?.data || error.message);

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
    const message = error.response?.data?.message || "Failed to send invitation";

    return res.status(status).json({
      success: false,
      message
    });
  }
}