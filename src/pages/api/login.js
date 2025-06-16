// File: /pages/api/login.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const NEXT_BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:8000/api/v1/";

    const response = await axios.post(`${NEXT_BACKEND_URL}users/login`, req.body, {
      withCredentials: true,
    });
    console.log(response.data)
    // Forward cookies
    if (response.headers["set-cookie"]) {
      res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    }

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    res.status(status).json({ success: false, message });
  }
}
