"use server";

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/invitations/[id]
 * Get a specific invitation by ID
 */
export async function GET(request, { params }) {
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
    const response = await fetch(`${process.env.BACKEND_API_URL}/invitations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch invitation' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invitations/[id]
 * Revoke an invitation
 */
export async function DELETE(request, { params }) {
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
    const response = await fetch(`${process.env.BACKEND_API_URL}/invitations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to revoke invitation' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}