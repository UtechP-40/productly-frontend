'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const links = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Use Cases", href: "/#use-cases" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-muted/50 border-t border-muted text-muted-foreground text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Logo and Summary */}
        <div>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Productly<span className="text-primary">.</span>
          </Link>
          <p className="mt-2 text-muted-foreground">
            Simplifying field operations for management companies with AI-powered tools.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation</h4>
          <ul className="space-y-2">
            {links.map(link => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "hover:text-primary transition-colors",
                    pathname === link.href ? "text-primary font-medium" : ""
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
          <div className="flex gap-4 text-xl">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaLinkedin />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-muted py-4 text-xs">
        © {new Date().getFullYear()} Productly. All rights reserved.
      </div>
    </footer>
  );
}
