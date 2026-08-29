import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "المتميز لاب — إدارة التحاليل الطبية",
  description: "منصة المتميز لاب لإدارة الدكاترة والمعامل والمرضى ونتائج التحاليل",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
