// /pages/api/auth/login.js
import axios from "axios";

/**
 * API route for user login
 * @route POST /api/auth/login
 * @description Authenticates a user with email and password
 * @access Public
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Forward request to backend
    const response = await axios.post(
      `${NEXT_BACKEND_URL}auth/login`,
      { email, password, rememberMe },
      { withCredentials: true }
    );

    // Forward cookies from backend to client
    if (response.headers["set-cookie"]) {
      res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Login successful"
    });
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Login failed";

    return res.status(status).json({
      success: false,
      message
    });
  }
}