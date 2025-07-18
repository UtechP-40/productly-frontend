// /pages/api/auth/refresh.js
import axios from "axios";

/**
 * API route for refreshing authentication tokens
 * @route POST /api/auth/refresh
 * @description Refreshes authentication tokens using a refresh token
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
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    // Forward request to backend with cookies
    const response = await axios.post(
      `${NEXT_BACKEND_URL}auth/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ")
        }
      }
    );

    // Forward cookies from backend to client
    if (response.headers["set-cookie"]) {
      res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    }

    // Return success response with new access token
    return res.status(200).json({
      success: true,
      data: {
        accessToken: response.data.data.accessToken
      },
      message: "Token refreshed successfully"
    });
  } catch (error) {
    console.error("Token refresh API error:", error.response?.data || error.message);

    // If refresh token is invalid, clear all cookies
    if (error.response?.status === 401) {
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
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Token refresh failed";

    return res.status(status).json({
      success: false,
      message
    });
  }
}