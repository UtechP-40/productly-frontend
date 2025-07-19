"use server";

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/invitations
 * Get all invitations for the current organization
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

    // Extract query parameters
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 20;
    const status = url.searchParams.get('status') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    
    // Forward request to backend
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/invitations?page=${page}&limit=${limit}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch invitations' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invitations
 * Create a new invitation or bulk invitations
 */
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Forward request to backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to create invitation' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}