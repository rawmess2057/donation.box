interface SkeletonProps {
  className?: string;
  as?: "div" | "span";
}

export default function LoadingSkeleton({ className = "", as: Tag = "div" }: SkeletonProps) {
  return (
    <Tag
      className={`animate-pulse bg-bg-muted rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}
