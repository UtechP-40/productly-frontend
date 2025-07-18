// /pages/api/auth/validate-password.js
import axios from "axios";

/**
 * API route for validating password strength
 * @route POST /api/auth/validate-password
 * @description Validates password strength without changing anything
 * @access Public
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    const { password } = req.body;

    // Validate required fields
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    // Forward request to backend
    const response = await axios.post(
      `${NEXT_BACKEND_URL}auth/validate-password`,
      { password },
      { withCredentials: true }
    );

    // Return validation result
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Password validation complete"
    });
  } catch (error) {
    console.error("Password validation API error:", error.response?.data || error.message);

    // For password validation, we want to return the validation result even if it fails
    if (error.response?.status === 400) {
      return res.status(200).json({
        success: true,
        data: error.response.data.data || {
          valid: false,
          score: 0,
          feedback: { warning: "Password is too weak", suggestions: [] }
        },
        message: error.response.data.message || "Password is too weak"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Password validation failed";

    return res.status(status).json({
      success: false,
      message
    });
  }
}