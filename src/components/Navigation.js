import React from 'react';
import Link from 'next/link';

const Navigation = ({ isAuthenticated }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4"> 
        <li>
          <Link href="/" className="text-white hover:text-gray-400">Home</Link>
        </li>
        <li>
          <Link href="/about" className="text-white hover:text-gray-400">About</Link>
        </li>
        <li>
          <Link href="/contact" className="text-white hover:text-gray-400">Contact</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <Link href="/dashboard" className="text-white hover:text-gray-400">Dashboard</Link>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login" className="text-white hover:text-gray-400">Login</Link>
            </li>
            <li>
              <Link href="/register" className="text-white hover:text-gray-400">Register</Link>
            </li>
            <li>
              <Link href="/join-organization" className="text-white hover:text-gray-400">Join Organization</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;