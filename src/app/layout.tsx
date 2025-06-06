// src/app/layout.tsx

// src/app/layout.tsx
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VSCloud - Web Hosting Platform",
  description: "Professional web hosting services for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        <AuthProvider>
          {" "}
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}



