// /pages/api/auth/verify-session.js
import axios from "axios";

/**
 * API route for verifying user session
 * @route GET /api/auth/verify-session
 * @description Verifies if the current session is valid and returns user information
 * @access Public
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    
    // Extract cookies to forward to backend
    const { cookies } = req;
    const sessionToken = cookies.sessionToken;
    const includeUser = req.query.includeUser === 'true';

    if (!sessionToken) {
      return res.status(200).json({
        success: true,
        data: {
          valid: false
        },
        message: "No active session"
      });
    }

    // Forward request to backend with cookies
    const response = await axios.get(
      `${NEXT_BACKEND_URL}auth/verify-session${includeUser ? '?includeUser=true' : ''}`,
      {
        withCredentials: true,
        headers: {
          Cookie: Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }
      }
    );

    // Return session verification result
    return res.status(200).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Session verification complete"
    });
  } catch (error) {
    console.error("Session verification API error:", error.response?.data || error.message);

    // For session verification, we don't want to throw errors to the client
    // Instead, we return a valid response with valid: false
    return res.status(200).json({
      success: true,
      data: {
        valid: false
      },
      message: "Invalid or expired session"
    });
  }
}