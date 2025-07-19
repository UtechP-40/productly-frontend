/**
 * Utility functions for handling authentication redirects
 */

/**
 * Get the redirect URL after login
 * @returns {string} URL to redirect to after login
 */
export function getRedirectAfterLogin() {
  if (typeof window === 'undefined') {
    return '/dashboard';
  }
  
  const redirectPath = sessionStorage.getItem('redirectAfterLogin');
  
  // Clear the stored path
  sessionStorage.removeItem('redirectAfterLogin');
  
  // Return the stored path or default to dashboard
  return redirectPath || '/dashboard';
}

/**
 * Store the current path for redirection after login
 * @param {string} path - Path to store
 */
export function storeRedirectPath(path) {
  if (typeof window === 'undefined' || !path) {
    return;
  }
  
  // Don't store auth-related paths
  if (path.startsWith('/auth/') || path === '/unauthorized') {
    return;
  }
  
  sessionStorage.setItem('redirectAfterLogin', path);
}

/**
 * Get redirect URL from query parameter
 * @param {string} from - From query parameter
 * @returns {string} URL to redirect to
 */
export function getRedirectFromQuery(from) {
  if (!from) {
    return getRedirectAfterLogin();
  }
  
  try {
    // Decode and validate the URL
    const decodedPath = decodeURIComponent(from);
    
    // Only allow relative URLs for security
    if (decodedPath.startsWith('/') && !decodedPath.includes('://')) {
      return decodedPath;
    }
  } catch (error) {
    console.error('Error decoding redirect URL:', error);
  }
  
  return getRedirectAfterLogin();
}