'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';

function Navigation({ isAuthenticated }) {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <nav className="bg-background border-b border-muted shadow-sm sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png" // Place your logo inside the `public` folder
            alt="Productly Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-lg font-semibold text-foreground">Productly</span>
        </Link>

        {/* Right side - Auth Links */}
        <ul className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/contact" className={`text-sm font-medium text-foreground hover:text-primary transition ${currentRoute === '/contact' ? 'text-primary' : ''}`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className={`text-sm font-medium text-foreground hover:text-primary transition ${currentRoute === '/about' ? 'text-primary' : ''}`}>
                  About
                </Link>
              </li>
              <Button
                asChild
                className="group flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-primary/90 shadow-md"
              >
                <Link href="/dashboard" className={`${currentRoute === '/dashboard' ? 'text-primary' : ''}`}>
                  <Monitor className="h-5 w-5 group-hover:animate-pulse" />
                  Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className={`text-sm font-medium text-foreground hover:text-primary transition ${currentRoute === '/login' ? 'text-primary' : ''}`}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className={`text-sm font-medium text-foreground hover:text-primary transition ${currentRoute === '/register' ? 'text-primary' : ''}`}>
                  Register
                </Link>
              </li>
              <li>
                <Link href="/join-organization" className={`text-sm font-medium text-foreground hover:text-primary transition ${currentRoute === '/join-organization' ? 'text-primary' : ''}`}>
                  Join Organization
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;