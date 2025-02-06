// src/app/(auth)/layout.tsx
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="VSCloud Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
