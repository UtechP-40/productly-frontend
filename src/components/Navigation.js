'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

function Navigation({ isAuthenticated }) {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b border-muted shadow-sm sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Productly Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-lg font-semibold text-foreground">Productly</span>
        </Link>

        {/* Right side - Auth Links */}
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname == '/' ? 'text-green-500' : ''}`}>
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/contact" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname === '/contact' ? 'text-green-500' : ''}`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname === '/about' ? 'text-green-500' : ''}`}>
                  About
                </Link>
              </li>
              <Button
                asChild
                className="group flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-primary/90 shadow-md"
              >
                <Link href="/dashboard" className={`${pathname === '/dashboard' ? 'text-green-500' : ''}`}>
                  <Monitor className="h-5 w-5 group-hover:animate-pulse" />
                  Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname === '/login' ? 'text-green-500' : ''}`}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname === '/register' ? 'text-green-500' : ''}`}>
                  Register
                </Link>
              </li>
              <li>
                <Link href="/join-organization" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname === '/join-organization' ? 'text-green-500' : ''}`}>
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
