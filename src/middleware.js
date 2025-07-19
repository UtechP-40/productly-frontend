/**
 * Next.js middleware for API route protection and security
 */

import { NextResponse } from 'next/server';
import { sanitizeString } from './middleware/apiValidation';

// Define paths that should be protected
const API_PATHS = ['/api/auth', '/api/roles', '/api/invitations'];

// Define paths that are public (no authentication required)
const PUBLIC_API_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-invitation',
  '/api/auth/verify-session',
  '/api/auth/validate-password'
];

/**
 * Next.js middleware function
 * @param {Object} request - Next.js request object
 * @returns {NextResponse} - Next.js response object
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Only apply middleware to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Create a response object that we can modify
  const response = NextResponse.next();
  
  // Add security headers to all API responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Check if this is a protected API path
  const isProtectedPath = API_PATHS.some(path => pathname.startsWith(path));
  const isPublicPath = PUBLIC_API_PATHS.some(path => pathname.startsWith(path));
  
  // If this is a protected path and not a public path, check for authentication
  if (isProtectedPath && !isPublicPath) {
    // Check for session token cookie
    const sessionToken = request.cookies.get('sessionToken')?.value;
    
    if (!sessionToken) {
      // No session token, redirect to login
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Authentication required'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
  
  // For GET requests, sanitize query parameters
  if (request.method === 'GET') {
    const url = request.nextUrl.clone();
    const params = url.searchParams;
    
    // Create a new URL with sanitized parameters
    const sanitizedUrl = new URL(url.origin + url.pathname);
    
    // Sanitize each parameter
    for (const [key, value] of params.entries()) {
      sanitizedUrl.searchParams.append(key, sanitizeString(value));
    }
    
    // If the URL changed, redirect to the sanitized URL
    if (sanitizedUrl.toString() !== url.toString()) {
      return NextResponse.redirect(sanitizedUrl);
    }
  }
  
  return response;
}

/**
 * Configure which paths this middleware applies to
 */
export const config = {
  matcher: [
    '/api/:path*'
  ]
};