// /pages/api/auth/verify-invitation.js
import axios from "axios";

/**
 * Validates an invitation token format
 * @param {string} token - The token to validate
 * @returns {boolean} - Whether the token format is valid
 */
const isValidInvitationToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    
    // Token should be alphanumeric and have a reasonable length
    return /^[A-Za-z0-9_-]{20,128}$/.test(token);
};

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

        // Validate token format
        if (!isValidInvitationToken(token)) {
            return res.status(400).json({
                success: false,
                message: "Invalid invitation token format"
            });
        }

        // Sanitize token by encoding it for URL
        const sanitizedToken = encodeURIComponent(token.trim());
        
        const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";

        // Forward request to backend with rate limiting protection
        try {
            const response = await axios.get(`${NEXT_BACKEND_URL}auth/verify-invitation`, {
                params: { token: sanitizedToken },
                withCredentials: true,
                // Add timeout to prevent hanging requests
                timeout: 10000,
                // Add headers for security
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            // Validate response data structure
            if (!response.data || typeof response.data !== 'object') {
                throw new Error('Invalid response format from backend');
            }

            // Return success response with invitation data
            return res.status(200).json({
                success: true,
                data: response.data.data,
                message: response.data.message || "Invitation verified successfully"
            });
        } catch (axiosError) {
            // Handle specific axios errors
            if (axiosError.code === 'ECONNABORTED') {
                return res.status(504).json({
                    success: false,
                    message: "Request timeout while verifying invitation"
                });
            }
            
            throw axiosError; // Re-throw for general error handling
        }
    } catch (error) {
        console.error("Verify invitation API error:", error.response?.data || error.message);

        // Handle rate limiting specifically
        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                message: "Too many verification attempts. Please try again later."
            });
        }

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