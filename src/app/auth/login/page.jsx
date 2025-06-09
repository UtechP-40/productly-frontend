"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hook this to your API
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        alert("Login successful!");
        // Redirect to dashboard or home
      } else {
        alert(result.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div>
      <Navigation isAuthenticated={false} />

      <div className="min-h-screen bg-white text-gray-900 flex">
        {/* Left image section */}
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

        {/* Right login form section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Login to Productly</h1>
              <p className="text-muted-foreground">
                Access your dashboard and manage your operations.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
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

              {/* Password */}
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

              {/* Remember + Forgot password */}
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

              {/* Submit */}
              <Button size="lg" className="w-full mt-4" type="submit">
                Login
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Google login button (Hook into OAuth) */}
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

            {/* Security info */}
            <div className="text-xs text-center text-muted-foreground">
              🔒 Your credentials are securely encrypted.
            </div>

            {/* Register CTA */}
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