"use server";

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/roles/permissions/matrix
 * Get permission matrix for UI display
 */
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Forward request to backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/roles/permissions/matrix`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch permission matrix' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching permission matrix:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}