"use client";

import dynamic from "next/dynamic";

const ToastProvider = dynamic(
  () => import("@/components/ui/Toast").then((m) => m.ToastProvider),
  { ssr: false },
);

export default function ToastProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
