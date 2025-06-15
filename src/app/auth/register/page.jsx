"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    slug: "",
    userType: "ADMIN_PORTAL",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) return toast.error("Please agree to the terms.");
    if (form.password !== form.confirmPassword)
      return toast.warning("Passwords do not match.");

    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      userType: form.userType,
    };

    const organizationData = {
      name: form.orgName,
      slug:
        form.slug ||
        form.orgName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      email: form.email,
    };

    const toastId = toast.loading("Registering user...");

    try {
      const res = await axios.post("/api/register", {
        userData,
        organizationData,
      });

      toast.dismiss(toastId);

      if (res.data.success) {
        toast.success("Registration successful!");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Server error occurred.");
    }
  };

  return (
    <div>
      <Navigation isAuthenticated={false} />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />

      <div className="min-h-screen bg-white text-gray-900 flex">
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

        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Start managing operations, agents, and insights with Productly.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div>
                <Label htmlFor="slug">Subdomain (optional)</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="company-name"
                  onChange={handleChange}
                />
              </div>
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
                  I agree to the {" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>
                </span>
              </div>
              <Button size="lg" className="w-full mt-4">
                Register
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm">
              Already have an account? {" "}
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
