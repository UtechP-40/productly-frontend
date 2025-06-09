"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

// Main Register Component
export default function RegisterPage() {
  // Local state for the registration form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    slug: "",
    userType: "ADMIN_PORTAL", // Default selected type
    agree: false,
  });

  // Updates local state on input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submission handler (hook this to your API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) return alert("Please agree to the terms.");
    if (form.password !== form.confirmPassword) return alert("Passwords do not match.");

    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      userType: form.userType,
    };

    const organizationData = {
      name: form.orgName,
      slug: form.slug,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData, organizationData }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Registration successful!");
        // Redirect to login or dashboard
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  return (
    <div>
      {/* Global Navigation (Not Authenticated) */}
      <Navigation isAuthenticated={false} />

      {/* Full Page Layout */}
      <div className="min-h-screen bg-white text-gray-900 flex">
        {/* Left visual section with intro and image */}
        <div className="hidden md:flex w-1/2 relative">
          <Image
            src="https://images.unsplash.com/photo-1600476061596-a0815671e5c8?q=80&w=1887&auto=format&fit=crop"
            alt="Productly Field"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Join Productly</h2>
            <p className="text-white/80 text-lg">
              Empower your field teams and streamline operations from one powerful platform.
            </p>
            <ul className="mt-6 space-y-2 text-white/70 text-sm list-disc list-inside">
              <li>Real-time task updates</li>
              <li>Smart analytics dashboard</li>
              <li>Voice assistant for field agents</li>
            </ul>
          </div>
        </div>

        {/* Right section: Registration Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Start managing operations, agents, and insights with Productly.
              </p>
            </div>

            {/* Actual Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Jane"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Organization Name */}
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  placeholder="Your Company Pvt. Ltd."
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Slug (optional subdomain) */}
              <div>
                <Label htmlFor="slug">Subdomain (optional)</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="company-name"
                  onChange={handleChange}
                />
              </div>

              {/* User Role Type */}
              <div>
                <Label htmlFor="userType">User Type</Label>
                <select
                  id="userType"
                  name="userType"
                  required
                  value={form.userType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="ADMIN_PORTAL">Admin Portal</option>
                  <option value="EMPLOYEE_APP">Employee App</option>
                </select>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2 text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>
                </span>
              </div>

              {/* Submit Button */}
              <Button size="lg" className="w-full mt-4">Register</Button>
            </form>

            {/* Already registered */}
            <p className="text-center text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}