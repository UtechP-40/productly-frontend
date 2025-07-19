/**
 * Password strength hook and components
 * Provides utilities for checking password strength and rendering UI components
 */

import { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

/**
 * Hook to check password strength
 * @param {string} password - Password to check
 * @returns {Object} - Password strength information
 */
export function usePasswordStrength(password) {
  const [strength, setStrength] = useState({
    score: 0,
    isStrong: false,
    feedback: {
      warning: '',
      suggestions: []
    }
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        isStrong: false,
        feedback: {
          warning: '',
          suggestions: []
        }
      });
      return;
    }

    // Check password strength
    const hasLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Calculate score (0-4)
    let score = 0;
    if (hasLength) score++;
    if (hasLowercase && hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Generate feedback
    const feedback = {
      warning: '',
      suggestions: []
    };

    if (score < 2) {
      feedback.warning = 'Weak password';
    } else if (score < 4) {
      feedback.warning = 'Moderate password';
    }

    if (!hasLength) {
      feedback.suggestions.push('Use at least 8 characters');
    }
    if (!(hasLowercase && hasUppercase)) {
      feedback.suggestions.push('Mix uppercase and lowercase letters');
    }
    if (!hasNumber) {
      feedback.suggestions.push('Include numbers');
    }
    if (!hasSpecial) {
      feedback.suggestions.push('Include special characters');
    }

    setStrength({
      score,
      isStrong: score >= 3,
      feedback
    });
  }, [password]);

  return strength;
}

/**
 * Password strength meter component
 * @param {Object} props - Component props
 * @param {number} props.strength - Password strength score (0-4)
 */
export function PasswordStrengthMeter({ strength }) {
  // Define colors for different strength levels
  const colors = [
    'bg-red-500',           // Very weak (0)
    'bg-orange-500',        // Weak (1)
    'bg-yellow-500',        // Fair (2)
    'bg-lime-500',          // Good (3)
    'bg-green-500'          // Strong (4)
  ];

  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-300 ${colors[strength] || colors[0]}`}
        style={{ width: `${(strength / 4) * 100}%` }}
      />
    </div>
  );
}

/**
 * Password requirements component
 * @param {Object} props - Component props
 * @param {string} props.password - Password to check
 */
export function PasswordRequirements({ password }) {
  // Define requirements
  const requirements = [
    { 
      label: 'At least 8 characters', 
      check: (pwd) => pwd.length >= 8 
    },
    { 
      label: 'At least one uppercase letter', 
      check: (pwd) => /[A-Z]/.test(pwd) 
    },
    { 
      label: 'At least one lowercase letter', 
      check: (pwd) => /[a-z]/.test(pwd) 
    },
    { 
      label: 'At least one number', 
      check: (pwd) => /[0-9]/.test(pwd) 
    },
    { 
      label: 'At least one special character', 
      check: (pwd) => /[^A-Za-z0-9]/.test(pwd) 
    }
  ];

  return (
    <div className="text-xs space-y-1 mt-2">
      <p className="font-medium text-muted-foreground">Password requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isMet = password && req.check(password);
          
          return (
            <li key={index} className="flex items-center gap-2">
              {isMet ? (
                <FiCheck className="text-green-500" />
              ) : (
                <FiX className="text-muted-foreground" />
              )}
              <span className={isMet ? 'text-green-500' : 'text-muted-foreground'}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}