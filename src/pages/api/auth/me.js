// /pages/api/auth/me.js
import axios from "axios";

/**
 * API route for getting current user information
 * @route GET /api/auth/me
 * @description Returns the current authenticated user's information
 * @access Private
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    
    // Extract cookies to forward to backend
    const { cookies } = req;
    const accessToken = cookies.accessToken;
    const sessionToken = cookies.sessionToken;

    if (!accessToken || !sessionToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Forward request to backend with cookies
    const response = await axios.get(
      `${NEXT_BACKEND_URL}auth/me`,
      {
        withCredentials: true,
        headers: {
          Cookie: Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }
      }
    );

    // Return user data
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: "User information retrieved successfully"
    });
  } catch (error) {
    console.error("Get user API error:", error.response?.data || error.message);

    // Handle token expiration by redirecting to refresh token
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
        code: "TOKEN_EXPIRED"
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to retrieve user information";

    return res.status(status).json({
      success: false,
      message
    });
  }
}