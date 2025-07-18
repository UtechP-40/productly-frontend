"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// UI Components
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { FiAlertCircle, FiLock, FiUser, FiMail, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";

// Password strength validation schema
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

// Registration form validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  invitationToken: z.string().min(1, { message: "Invitation token is required" }),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitationData, setInvitationData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { login } = useAuth();
  
  // Get token from URL
  const token = searchParams.get("token");
  
  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      invitationToken: token || "",
      agree: false,
    },
  });
  
  // Watch password for strength indicator
  const password = watch("password", "");
  
  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  // Verify invitation token on component mount
  useEffect(() => {
    const verifyInvitation = async () => {
      if (!token) {
        setIsVerifying(false);
        setError("No invitation token provided. Please use the link from your invitation email.");
        return;
      }
      
      try {
        // Set the token in the form
        setValue("invitationToken", token);
        
        // Verify the token with the API
        const response = await axios.get(`/api/auth/verify-invitation?token=${token}`);
        
        if (response.data.success) {
          setInvitationData(response.data.data);
          // Pre-fill email from invitation
          if (response.data.data.email) {
            setValue("email", response.data.data.email);
          }
        } else {
          setError(response.data.message || "Invalid invitation token");
        }
      } catch (err) {
        console.error("Invitation verification error:", err);
        setError(err.response?.data?.message || "Failed to verify invitation token");
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyInvitation();
  }, [token, setValue]);
  
  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Submit registration data
      const response = await axios.post("/api/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        invitationToken: data.invitationToken,
      });
      
      if (response.data.success) {
        toast.success("Registration successful! Logging you in...");
        
        // Try to log in automatically
        try {
          await login({
            email: invitationData.email,
            password: data.password,
          });
          
          // Redirect to dashboard after short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } catch (loginErr) {
          console.error("Auto-login error:", loginErr);
          toast.info("Please log in with your new credentials");
          
          // Redirect to login page after short delay
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        }
      } else {
        setError(response.data.message || "Registration failed");
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "An error occurred during registration");
      toast.error(err.response?.data?.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password strength indicator
  const renderPasswordStrength = () => {
    const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"];
    
    return (
      <div className="mt-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs">{passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "No password"}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${passwordStrength > 0 ? strengthColors[passwordStrength - 1] : ""}`}
            style={{ width: `${passwordStrength * 20}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Password requirements list
  const renderPasswordRequirements = () => {
    const requirements = [
      { label: "At least 8 characters", test: password.length >= 8 },
      { label: "At least one uppercase letter", test: /[A-Z]/.test(password) },
      { label: "At least one lowercase letter", test: /[a-z]/.test(password) },
      { label: "At least one number", test: /[0-9]/.test(password) },
      { label: "At least one special character", test: /[^A-Za-z0-9]/.test(password) },
    ];
    
    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs text-muted-foreground">Password requirements:</p>
        <ul className="text-xs space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center">
              {req.test ? (
                <FiCheck className="text-green-500 mr-1" size={12} />
              ) : (
                <FiX className="text-red-500 mr-1" size={12} />
              )}
              <span className={req.test ? "text-green-700" : "text-muted-foreground"}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
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
            src="https://images.unsplash.com/photo-1600476061596-a0815671e5c8?q=80&w=1887&auto=format&fit=crop"
            alt="Productly Field"
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
                  {isVerifying ? (
                    "Verifying your invitation..."
                  ) : invitationData ? (
                    `Set up your account for ${invitationData.organizationName || "your organization"}`
                  ) : (
                    "Create your account to join your team"
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isVerifying ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="mb-4">
                    <FiAlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    
                    <div className="flex items-start space-x-2 text-sm">
                      <input
                        type="checkbox"
                        id="agree"
                        {...register("agree")}
                        className="mt-1"
                      />
                      <Label htmlFor="agree" className="font-normal">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </Link>
                      </Label>
                    </div>
                    {errors.agree && (
                      <p className="text-destructive text-xs">{errors.agree.message}</p>
                    )}
                    
                    <Input
                      type="hidden"
                      {...register("invitationToken")}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Complete Registration"}
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
