import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/roles/[id]/conflicts
 * Check for permission conflicts with other roles
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Role ID is required' },
        { status: 400 }
      );
    }
    
    // Get cookies for authentication
    const cookieStore = cookies();
    const authCookies = {};
    
    // Add all cookies to the request
    for (const cookie of cookieStore.getAll()) {
      authCookies[cookie.name] = cookie.value;
    }
    
    // Forward request to backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/roles/${id}/conflicts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': Object.entries(authCookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ')
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to check permission conflicts' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking permission conflicts:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}