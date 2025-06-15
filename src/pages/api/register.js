// /pages/api/register.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";
    const { userData, organizationData } = req.body;

    // Send data in the format expected by backend (nested)
    const payload = {
      userData,
      organizationData,
    };

    const response = await axios.post(`${NEXT_BACKEND_URL}organizations/register`, payload);

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Register API error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    res.status(status).json({ success: false, message });
  }
}
