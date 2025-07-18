// /pages/api/auth/verify-invitation.js
import axios from "axios";

/**
 * API route for verifying invitation tokens
 * @route GET /api/auth/verify-invitation
 * @description Verifies an invitation token and returns invitation details
 * @access Public
 */
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { token } = req.query;

        // Validate token parameter
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Invitation token is required"
            });
        }

        const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";

        // Forward request to backend
        const response = await axios.get(`${NEXT_BACKEND_URL}auth/verify-invitation`, {
            params: { token },
            withCredentials: true,
        });

        // Return success response with invitation data
        return res.status(200).json({
            success: true,
            data: response.data.data,
            message: response.data.message || "Invitation verified successfully"
        });
    } catch (error) {
        console.error("Verify invitation API error:", error.response?.data || error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data?.message || "Failed to verify invitation";
        const errorData = error.response?.data?.data || null;

        return res.status(status).json({
            success: false,
            message,
            error: errorData
        });
    }
}