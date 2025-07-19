"use client";

import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { FiAlertTriangle, FiArrowLeft, FiHome } from 'react-icons/fi';

/**
 * Unauthorized page
 * Displayed when a user tries to access a page they don't have permission for
 */
export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <FiAlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <FiArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <FiHome className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}