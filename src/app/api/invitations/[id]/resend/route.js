"use server";

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * POST /api/invitations/[id]/resend
 * Resend an invitation
 */
export async function POST(request, { params }) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Forward request to backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/invitations/${id}/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to resend invitation' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error resending invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}