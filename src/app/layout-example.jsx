"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from "../providers/AuthProviderWrapper";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

/**
 * Example of how to use AuthProviderWrapper in the root layout
 * This is just an example - don't replace your actual layout.jsx with this
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>
          <Toaster position="top-center" />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}