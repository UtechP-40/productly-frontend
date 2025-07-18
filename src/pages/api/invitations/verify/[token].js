// /pages/api/invitations/verify/[token].js
import axios from "axios";

/**
 * API route for verifying invitation tokens
 * @route GET /api/invitations/verify/[token]
 * @description Verifies an invitation token and returns invitation details
 * @access Public
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
  const { token } = req.query;

  try {
    const response = await axios.get(
      `${NEXT_BACKEND_URL}invitations/verify/${token}`,
      { withCredentials: true }
    );

    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Invitation verified successfully"
    });
  } catch (error) {
    console.error("Invitation verification API error:", error.response?.data || error.message);

    // For invitation verification, we want to return a specific error
    if (error.response?.status === 404 || error.response?.status === 400) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.message || "Invalid or expired invitation token",
        code: "INVALID_INVITATION"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to verify invitation";

    return res.status(status).json({
      success: false,
      message
    });
  }
}