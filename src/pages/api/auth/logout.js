// /pages/api/auth/logout.js
import axios from "axios";

/**
 * API route for user logout with secure cookie clearing
 * @route POST /api/auth/logout
 * @description Logs out a user by revoking their session and clearing cookies
 * @access Public
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    
    // Extract cookies to forward to backend
    const { cookies } = req;
    const sessionToken = cookies.sessionToken;
    const allSessions = req.body?.allSessions === true;

    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: "No active session found"
      });
    }

    // Forward request to backend with cookies
    const response = await axios.post(
      `${NEXT_BACKEND_URL}auth/logout`,
      { allSessions },
      {
        withCredentials: true,
        headers: {
          Cookie: Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }
      }
    );

    // Clear cookies on the client side
    const commonOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    };

    res.setHeader("Set-Cookie", [
      `accessToken=; Max-Age=0; ${Object.entries(commonOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`,
      `refreshToken=; Max-Age=0; ${Object.entries(commonOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`,
      `sessionToken=; Max-Age=0; ${Object.entries(commonOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`
    ]);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout API error:", error.response?.data || error.message);

    // Even if backend call fails, clear cookies anyway for security
    const commonOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    };

    res.setHeader("Set-Cookie", [
      `accessToken=; Max-Age=0; ${Object.entries(commonOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`,
      `refreshToken=; Max-Age=0; ${Object.entries(commonOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`,
      `sessionToken=; Max-Age=0; ${Object.entries(commonOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`
    ]);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Logout failed";

    return res.status(status).json({
      success: false,
      message
    });
  }
}