"use client";

import { Skeleton } from "../../../components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import Navigation from "../../../components/Navigation";

export default function VerifyInvitationLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left side - Hero image placeholder (hidden on mobile) */}
        <div className="hidden md:flex w-1/2 relative bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
          <div className="relative z-20 p-12">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3" />
            <div className="mt-6 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Right side - Loading state */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="text-center w-full">
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mx-auto mt-1" />
                  </div>
                  <div className="w-full max-w-md space-y-3">
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Skeleton className="h-3 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}