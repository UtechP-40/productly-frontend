import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('authToken');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const userData = await fetchUserData(token);

  if (!userData) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Attach user data to the request for use in pages
  request.userData = userData;

  return NextResponse.next();
}

async function fetchUserData(token) {
  // Replace with your actual data fetching logic
  try {
    const response = await fetch('https://api.example.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}