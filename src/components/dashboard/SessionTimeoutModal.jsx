"use client";

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Clock, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

/**
 * SessionTimeoutModal Component
 * Displays a warning when the user's session is about to expire
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onExtend - Function to extend the session
 * @param {number} props.timeRemaining - Time remaining in seconds
 * @returns {React.ReactNode} Session timeout modal component
 */
export default function SessionTimeoutModal({ 
  isOpen, 
  onClose, 
  onExtend, 
  timeRemaining = 300 // Default 5 minutes
}) {
  const [countdown, setCountdown] = useState(timeRemaining);
  
  // Format seconds as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset countdown when modal opens
    setCountdown(timeRemaining);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup timer on unmount or when modal closes
    return () => clearInterval(timer);
  }, [isOpen, timeRemaining, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your session is about to expire due to inactivity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Clock className="h-6 w-6" />
            <span className="text-2xl font-mono">{formatTime(countdown)}</span>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            You will be automatically logged out when the timer reaches zero.
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Log Out Now
          </Button>
          <Button onClick={onExtend}>
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}