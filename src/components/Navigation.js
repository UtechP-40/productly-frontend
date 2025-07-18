'use client';

import React from 'react';
import { Monitor, LogOut, User } from 'lucide-react';
import { Button } from "./ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const activeClass = 'text-[#1E3D76]'; 

  return (
    <nav className="bg-background border-b border-muted shadow-sm sticky z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Productly Logo"
            width={130}
            height={40}
            // className="rounded-md"
          />
        </Link>

        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/" className={`text-sm font-medium hover:text-primary transition ${pathname === '/' ? activeClass : 'text-foreground'}`}>
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/contact" className={`text-sm font-medium hover:text-primary transition ${pathname === '/contact' ? activeClass : 'text-foreground'}`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className={`text-sm font-medium hover:text-primary transition ${pathname === '/about' ? activeClass : 'text-foreground'}`}>
                  About
                </Link>
              </li>
              <Button
                asChild
                className="group flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-primary/90 shadow-md"
              >
                <Link href="/dashboard" className={`${pathname === '/dashboard' ? activeClass : ''}`}>
                  <Monitor className="h-5 w-5 group-hover:animate-pulse" />
                  Dashboard
                </Link>
              </Button>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user?.firstName} {user?.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/auth/login" className={`text-sm font-medium  hover:text-primary transition ${pathname === '/auth/login' ? activeClass : 'text-foreground'}`}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className={`text-sm font-medium  hover:text-primary transition ${pathname === '/auth/register' ? activeClass : 'text-foreground'}`}>
                  Register
                </Link>
              </li>
              {/* <li>
                <Link href="/join-organization" className={`text-sm font-medium text-foreground hover:text-primary transition ${pathname === '/join-organization' ? activeClass : ''}`}>
                  Join Organization
                </Link>
              </li> */}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
