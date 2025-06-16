"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { FcGoogle } from "react-icons/fc";

import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Registering user...");
    try {
      const res = await axios.post(
        "/api/login",
        { email: form.email, password: form.password },
        { withCredentials: true }
      );
      toast.dismiss(toastId);
      // console.log(res)
      const data = res?.data?.data?.data
      if (data?.accessToken) {
        // alert("Login successful!");
        // TODO: Redirect to dashboard
        localStorage.setItem('accessToken', data?.accessToken)
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        // alert(res.data?.message || "Login failed.");
        toast.error(res.data?.message || "Login failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation isAuthenticated={false} />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="min-h-screen bg-white text-gray-900 flex">
        <div className="hidden md:flex w-1/2 relative">
          <Image
            src="https://images.unsplash.com/photo-1702726001096-096efcf640b8?q=80&w=1635&auto=format&fit=crop"
            alt="User workspace hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-white/80 text-lg">
              Continue empowering your field team with Productly.
            </p>
            <ul className="mt-6 space-y-2 text-white/70 text-sm list-disc list-inside">
              <li>Real-time updates</li>
              <li>Offline mobile support</li>
              <li>AI assistant for smart decisions</li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Login to Productly</h1>
              <p className="text-muted-foreground">
                Access your dashboard and manage your operations.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button size="lg" className="w-full mt-4" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                type="button"
                onClick={() => alert("Hook this into Google OAuth")}
              >
                <FcGoogle size={20} />
                <span className="sr-only">Login with Google</span>
                <span>Login with Google</span>
              </Button>
            </form>

            <div className="text-xs text-center text-muted-foreground">
              🔒 Your credentials are securely encrypted.
            </div>

            <p className="text-center text-muted-foreground text-sm">
              Don’t have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
