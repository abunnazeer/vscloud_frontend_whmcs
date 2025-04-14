// // src/app/(auth)/reset-password/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const resetPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string(),
//   })
//   .refine(data => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// export default function ResetPasswordPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isLoading, setIsLoading] = useState(false);
//   const token = searchParams.get("token");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ResetPasswordFormValues>({
//     resolver: zodResolver(resetPasswordSchema),
//   });

//   const onSubmit = async (data: ResetPasswordFormValues) => {
//     try {
//       setIsLoading(true);
//       // TODO: Implement reset password logic here using the token
//       console.log("Reset password data:", { ...data, token });
//       router.push("/login");
//     } catch (error) {
//       console.error("Reset password error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!token) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-2 text-center">
//           <h1 className="text-2xl font-semibold tracking-tight">
//             Invalid link
//           </h1>
//           <p className="text-sm text-gray-500">
//             This password reset link is invalid or has expired.
//           </p>
//         </div>
//         <Button
//           onClick={() => router.push("/forgot-password")}
//           variant="outline"
//           className="w-full"
//         >
//           Request new reset link
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2 text-center">
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Reset password
//         </h1>
//         <p className="text-sm text-gray-500">Enter your new password below</p>
//       </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="space-y-2">
//           <label
//             htmlFor="password"
//             className="text-sm font-medium leading-none"
//           >
//             New Password
//           </label>
//           <Input
//             id="password"
//             type="password"
//             {...register("password")}
//             error={errors.password?.message}
//           />
//         </div>
//         <div className="space-y-2">
//           <label
//             htmlFor="confirmPassword"
//             className="text-sm font-medium leading-none"
//           >
//             Confirm New Password
//           </label>
//           <Input
//             id="confirmPassword"
//             type="password"
//             {...register("confirmPassword")}
//             error={errors.confirmPassword?.message}
//           />
//         </div>
//         <Button type="submit" className="w-full" loading={isLoading}>
//           Reset Password
//         </Button>
//       </form>
//     </div>
//   );
// }

// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      if (!token) {
        throw new Error("Reset token is missing");
      }

      await api.auth.resetPassword(token, data.password, data.confirmPassword);
      toast.success(
        "Password reset successfully. You can now log in with your new password."
      );
      router.push("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error instanceof Error ? error.message : "Password reset failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Invalid link
          </h1>
          <p className="text-sm text-gray-500">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Button
          onClick={() => router.push("/forgot-password")}
          variant="outline"
          className="w-full"
        >
          Request new reset link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-gray-500">Enter your new password below</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none"
          >
            New Password
          </label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <p className="text-xs text-gray-500">
            Must contain at least 8 characters, with uppercase, lowercase,
            number and special character
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none"
          >
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
