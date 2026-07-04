"use client";

interface GlassNavProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassNav({ children, className = "" }: GlassNavProps) {
  return (
    <nav
      className={[
        "fixed top-0 left-0 w-full z-50",
        "backdrop-blur-2xl saturate-[2] border-b",
        "bg-white/10",
        "border-white/15",
        "shadow-[0_4px_30px_rgba(0,0,0,0.05)]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        {children}
      </div>
    </nav>
  );
}
