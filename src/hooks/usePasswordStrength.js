import { useState, useEffect } from 'react';

/**
 * Custom hook for password strength validation
 * @param {string} password - The password to validate
 * @returns {Object} - Password strength information
 */
export const usePasswordStrength = (password) => {
  const [strength, setStrength] = useState({
    score: 0, // 0-4 (0: very weak, 4: very strong)
    feedback: '',
    isStrong: false,
    checks: {
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false
    }
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        feedback: 'Password is required',
        isStrong: false,
        checks: {
          hasMinLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecialChar: false
        }
      });
      return;
    }

    // Check individual requirements
    const checks = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password)
    };

    // Calculate score based on checks
    let score = 0;
    if (checks.hasMinLength) score++;
    if (checks.hasUppercase) score++;
    if (checks.hasLowercase) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSpecialChar) score++;

    // Adjust score based on password length
    if (password.length > 12) score = Math.min(score + 1, 4);
    
    // Normalize score to 0-4 range
    score = Math.min(Math.floor(score * 0.8), 4);

    // Generate feedback based on score
    let feedback = '';
    switch (score) {
      case 0:
        feedback = 'Very weak password';
        break;
      case 1:
        feedback = 'Weak password';
        break;
      case 2:
        feedback = 'Fair password';
        break;
      case 3:
        feedback = 'Good password';
        break;
      case 4:
        feedback = 'Strong password';
        break;
      default:
        feedback = 'Password strength unknown';
    }

    // Determine if password is strong enough (score >= 3)
    const isStrong = score >= 3;

    setStrength({
      score,
      feedback,
      isStrong,
      checks
    });
  }, [password]);

  return strength;
};

/**
 * Get color for password strength indicator
 * @param {number} score - Password strength score (0-4)
 * @returns {string} - CSS color class
 */
export const getPasswordStrengthColor = (score) => {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-orange-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-green-500';
    case 4:
      return 'bg-emerald-500';
    default:
      return 'bg-gray-300';
  }
};

/**
 * Password strength requirements component
 * @param {Object} checks - Password requirement checks
 * @returns {JSX.Element} - Password requirements component
 */
export const PasswordRequirements = ({ checks }) => {
  return (
    <div className="mt-2 space-y-1 text-sm">
      <p className="font-medium text-muted-foreground mb-1">Password requirements:</p>
      <ul className="space-y-1 pl-1">
        <li className={`flex items-center gap-1 ${checks.hasMinLength ? 'text-green-600' : 'text-muted-foreground'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${checks.hasMinLength ? 'bg-green-600' : 'bg-muted'}`}></span>
          At least 8 characters
        </li>
        <li className={`flex items-center gap-1 ${checks.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${checks.hasUppercase ? 'bg-green-600' : 'bg-muted'}`}></span>
          At least one uppercase letter
        </li>
        <li className={`flex items-center gap-1 ${checks.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${checks.hasLowercase ? 'bg-green-600' : 'bg-muted'}`}></span>
          At least one lowercase letter
        </li>
        <li className={`flex items-center gap-1 ${checks.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${checks.hasNumber ? 'bg-green-600' : 'bg-muted'}`}></span>
          At least one number
        </li>
        <li className={`flex items-center gap-1 ${checks.hasSpecialChar ? 'text-green-600' : 'text-muted-foreground'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${checks.hasSpecialChar ? 'bg-green-600' : 'bg-muted'}`}></span>
          At least one special character
        </li>
      </ul>
    </div>
  );
};

/**
 * Password strength meter component
 * @param {number} score - Password strength score (0-4)
 * @returns {JSX.Element} - Password strength meter component
 */
export const PasswordStrengthMeter = ({ score }) => {
  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1">
        <div className={`w-1/4 rounded-l ${score >= 1 ? getPasswordStrengthColor(score) : 'bg-gray-200'}`}></div>
        <div className={`w-1/4 ${score >= 2 ? getPasswordStrengthColor(score) : 'bg-gray-200'}`}></div>
        <div className={`w-1/4 ${score >= 3 ? getPasswordStrengthColor(score) : 'bg-gray-200'}`}></div>
        <div className={`w-1/4 rounded-r ${score >= 4 ? getPasswordStrengthColor(score) : 'bg-gray-200'}`}></div>
      </div>
    </div>
  );
};