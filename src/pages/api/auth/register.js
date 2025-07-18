// /pages/api/auth/register.js
import axios from "axios";

/**
 * API route for user registration with invitation validation
 * @route POST /api/auth/register
 * @description Registers a new user from an invitation token
 * @access Public
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    const { firstName, lastName, password, invitationToken } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !password || !invitationToken) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, password, and invitation token are required"
      });
    }

    // Forward request to backend
    const response = await axios.post(`${NEXT_BACKEND_URL}auth/register`, req.body, {
      withCredentials: true,
    });

    // Forward cookies from backend to client
    if (response.headers["set-cookie"]) {
      res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    }

    // Return success response
    return res.status(201).json({
      success: true,
      data: response.data.data,
      message: response.data.message || "Registration successful"
    });
  } catch (error) {
    console.error("Register API error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Registration failed";
    const errorData = error.response?.data?.data || null;

    return res.status(status).json({
      success: false,
      message,
      error: errorData
    });
  }
}