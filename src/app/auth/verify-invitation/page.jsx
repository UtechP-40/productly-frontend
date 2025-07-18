"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// UI Components
import Navigation from "../../../components/Navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Skeleton } from "../../../components/ui/skeleton";

export default function VerifyInvitation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [invitationData, setInvitationData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, valid, invalid

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
          toast.success("Invitation verified successfully!");
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

  const handleProceedToRegistration = () => {
    if (invitationData && token) {
      router.push(`/auth/register?token=${token}`);
    }
  };

  const renderVerificationStatus = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="animate-spin">
            <FiLoader className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">Verifying your invitation</h3>
            <p className="text-muted-foreground">Please wait while we validate your invitation...</p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      );
    }

    if (verificationStatus === "valid" && invitationData) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="rounded-full bg-green-100 p-3">
            <FiCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium">Invitation Verified!</h3>
            <p className="text-muted-foreground mt-2">
              You've been invited to join {invitationData.organizationName || "the organization"} as a{" "}
              <span className="font-medium">{invitationData.roleName || "team member"}</span>.
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{invitationData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-medium">{invitationData.organizationName || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{invitationData.roleName || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invited by:</span>
                <span className="font-medium">{invitationData.invitedByName || "Admin"}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleProceedToRegistration} 
            className="w-full max-w-md"
            size="lg"
          >
            Complete Registration
          </Button>
        </div>
      );
    }

    return (
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
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1770&auto=format&fit=crop"
            alt="Invitation verification hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome to Productly</h2>
            <p className="text-white/80 text-lg">
              You're just a few steps away from joining your team.
            </p>
            <ul className="mt-6 space-y-2 text-white/70 text-sm list-disc list-inside">
              <li>Collaborate with your team in real-time</li>
              <li>Access powerful product management tools</li>
              <li>Streamline your workflow with AI assistance</li>
            </ul>
          </div>
        </div>

        {/* Right side - Verification status */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Invitation Verification</CardTitle>
                <CardDescription>
                  Verifying your invitation to join Productly
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {renderVerificationStatus()}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-xs text-center text-muted-foreground">
                  🔒 Your information is securely protected.
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