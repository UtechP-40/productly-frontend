/**
 * API validation middleware
 * Provides functions for validating and sanitizing API requests
 */

import { NextResponse } from 'next/server';

/**
 * Sanitizes a string by trimming and removing potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove potentially dangerous characters (script tags, etc.)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  return sanitized;
};

/**
 * Sanitizes an email address
 * @param {string} email - The email to sanitize
 * @returns {string} - The sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  // Trim whitespace and convert to lowercase
  return email.trim().toLowerCase();
};

/**
 * Sanitizes an object by sanitizing all string properties
 * @param {Object} data - The object to sanitize
 * @returns {Object} - The sanitized object
 */
export const sanitizeObject = (data) => {
  if (!data || typeof data !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else {
        sanitized[key] = sanitizeString(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Middleware to validate and sanitize API requests
 * @param {Function} handler - API route handler
 * @returns {Function} - Middleware wrapped handler
 */
export function withValidation(handler) {
  return async (req, res) => {
    // Clone the request to avoid modifying the original
    const request = req.clone();
    
    // For POST, PUT, PATCH requests, sanitize the body
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const body = await request.json();
        const sanitizedBody = sanitizeObject(body);
        
        // Create a new request with sanitized body
        const sanitizedReq = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(sanitizedBody),
          credentials: request.credentials,
          cache: request.cache,
          redirect: request.redirect,
          referrer: request.referrer,
          integrity: request.integrity,
        });
        
        // Pass the sanitized request to the handler
        return handler(sanitizedReq, res);
      } catch (error) {
        console.error('Error sanitizing request body:', error);
        
        // If there's an error parsing the body, return a 400 response
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Invalid request body'
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
    
    // For GET, DELETE requests, sanitize query parameters
    if (['GET', 'DELETE'].includes(request.method)) {
      const url = new URL(request.url);
      const params = url.searchParams;
      
      // Create a new URL with sanitized parameters
      const sanitizedUrl = new URL(url.origin + url.pathname);
      
      // Sanitize each parameter
      for (const [key, value] of params.entries()) {
        sanitizedUrl.searchParams.append(key, sanitizeString(value));
      }
      
      // Create a new request with sanitized URL
      const sanitizedReq = new Request(sanitizedUrl, {
        method: request.method,
        headers: request.headers,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        integrity: request.integrity,
      });
      
      // Pass the sanitized request to the handler
      return handler(sanitizedReq, res);
    }
    
    // For other methods, pass the request as is
    return handler(request, res);
  };
}

/**
 * Middleware to add security headers to API responses
 * @param {Function} handler - API route handler
 * @returns {Function} - Middleware wrapped handler
 */
export function withSecurityHeaders(handler) {
  return async (req, res) => {
    // Call the original handler
    const response = await handler(req, res);
    
    // Add security headers to the response
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "default-src 'self'");
    
    return response;
  };
}

/**
 * Middleware to add rate limiting to API routes
 * @param {Object} options - Rate limiting options
 * @param {number} options.limit - Maximum number of requests
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {Function} - Middleware function
 */
export function withRateLimit(options = { limit: 100, windowMs: 15 * 60 * 1000 }) {
  const requests = new Map();
  
  return (handler) => {
    return async (req, res) => {
      // Get client IP
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      
      // Get current time
      const now = Date.now();
      
      // Get client's request history
      const clientRequests = requests.get(ip) || [];
      
      // Filter requests within the time window
      const recentRequests = clientRequests.filter(time => time > now - options.windowMs);
      
      // Check if client has exceeded the limit
      if (recentRequests.length >= options.limit) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Too many requests, please try again later'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(options.windowMs / 1000)
            }
          }
        );
      }
      
      // Add current request to history
      recentRequests.push(now);
      requests.set(ip, recentRequests);
      
      // Call the original handler
      return handler(req, res);
    };
  };
}

/**
 * Combine multiple middleware functions
 * @param  {...Function} middlewares - Middleware functions to combine
 * @returns {Function} - Combined middleware function
 */
export function combineMiddleware(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}

/**
 * Create a secure API route with validation, security headers, and rate limiting
 * @param {Function} handler - API route handler
 * @param {Object} options - Options for middleware
 * @returns {Function} - Middleware wrapped handler
 */
export function createSecureApiRoute(handler, options = {}) {
  return combineMiddleware(
    withValidation,
    withSecurityHeaders,
    withRateLimit(options.rateLimit)
  )(handler);
}