"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../hooks/useAuth";
import { usePasswordStrength, PasswordStrengthMeter, PasswordRequirements } from "../../../hooks/usePasswordStrength";

// UI Components
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { FiAlertCircle, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Skeleton } from "../../../components/ui/skeleton";

// Form validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [invitationData, setInvitationData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, valid, invalid

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Get password strength
  const password = watch("password");
  const passwordStrength = usePasswordStrength(password);

  // Get auth context
  const { register: registerUser } = useAuth();

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!token) {
        setError("Invitation token is missing. Please check your invitation link.");
        setVerificationStatus("invalid");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-invitation?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setInvitationData(result.data);
          setVerificationStatus("valid");
        } else {
          setError(result.message || "Invalid or expired invitation.");
          setVerificationStatus("invalid");
          toast.error(result.message || "Invalid or expired invitation.");
        }
      } catch (err) {
        console.error("Invitation verification error:", err);
        setError("Failed to verify invitation. Please try again or contact support.");
        setVerificationStatus("invalid");
        toast.error("Failed to verify invitation. Please try again or contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyInvitation();
  }, [token]);

  // Form submission handler
  const onSubmit = async (data) => {
    if (!token || !invitationData) {
      setError("Invalid invitation. Please use a valid invitation link.");
      toast.error("Invalid invitation. Please use a valid invitation link.");
      return;
    }

    if (!passwordStrength.isStrong) {
      setError("Please use a stronger password.");
      toast.error("Please use a stronger password.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: invitationData.email, // Use email from invitation
        password: data.password,
        token: token
      });

      if (result.success) {
        toast.success("Registration successful! Redirecting to dashboard...");
        
        // Short delay before redirect for better UX
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(result.message || "Registration failed. Please try again.");
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.message || "An error occurred during registration. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render password strength meter
  const renderPasswordStrength = () => {
    if (!password) return null;
    
    return (
      <div className="mt-2">
        <PasswordStrengthMeter strength={passwordStrength.score} />
        <p className={`text-xs mt-1 ${
          passwordStrength.isStrong ? "text-green-500" : "text-amber-500"
        }`}>
          {passwordStrength.isStrong 
            ? "Password strength: Strong" 
            : `Password strength: ${passwordStrength.feedback.warning || "Weak"}`}
        </p>
      </div>
    );
  };

  // Render password requirements
  const renderPasswordRequirements = () => {
    if (!password) return null;
    
    return (
      <div className="mt-2">
        <PasswordRequirements password={password} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left side - Hero image (hidden on mobile) */}
        <div className="hidden md:flex w-1/2 relative">
          <Image
            src="https://images.unsplash.com/photo-1702726001096-096efcf640b8?q=80&w=1635&auto=format&fit=crop"
            alt="User workspace hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Complete Your Registration</h2>
            <p className="text-white/80 text-lg">
              You're just a few steps away from joining your team on Productly.
            </p>
            <ul className="mt-6 space-y-2 text-white/70 text-sm list-disc list-inside">
              <li>Secure role-based access</li>
              <li>Team collaboration tools</li>
              <li>Personalized dashboard</li>
            </ul>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Complete Registration</CardTitle>
                <CardDescription>
                  {isLoading ? (
                    "Verifying your invitation..."
                  ) : invitationData ? (
                    `Set up your account for ${invitationData.organizationName || "your organization"}`
                  ) : (
                    "Create your account to join your team"
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : verificationStatus === "invalid" ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="rounded-full bg-red-100 p-3">
                      <FiAlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-medium">Invalid Invitation</h3>
                      <p className="text-muted-foreground mt-2">{error || "This invitation link is invalid or has expired."}</p>
                    </div>
                    <div className="space-y-4 w-full max-w-md">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push("/auth/login")}
                      >
                        Go to Login
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        If you believe this is an error, please contact your organization administrator.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <FiAlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {invitationData && (
                      <Alert className="mb-4 bg-primary/10 border-primary/20">
                        <div className="flex flex-col">
                          <p className="font-medium">You've been invited to join:</p>
                          <p>{invitationData.organizationName || "Organization"}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {invitationData.email && `as ${invitationData.email}`}
                            {invitationData.role && ` with role: ${invitationData.role}`}
                          </p>
                        </div>
                      </Alert>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <FiUser className="h-4 w-4" />
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className={errors.firstName ? "border-destructive" : ""}
                          placeholder="Jane"
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-xs">{errors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2">
                          <FiUser className="h-4 w-4" />
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className={errors.lastName ? "border-destructive" : ""}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-xs">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    {invitationData && invitationData.email && (
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <FiMail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={invitationData.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email address from your invitation</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <FiLock className="h-4 w-4" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        className={errors.password ? "border-destructive" : ""}
                        placeholder="••••••••"
                      />
                      {renderPasswordStrength()}
                      {renderPasswordRequirements()}
                      {errors.password && (
                        <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                        <FiLock className="h-4 w-4" />
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-destructive" : ""}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Complete Registration"}
                    </Button>
                  </form>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-xs text-center text-muted-foreground">
                  🔒 Your information is securely encrypted.
                </div>
                
                <p className="text-center text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Login here
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}