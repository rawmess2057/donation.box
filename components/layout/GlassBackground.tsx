export default function GlassBackground() {
  return (
    <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full opacity-12"
        style={{
          background: "radial-gradient(circle, #7fbf7f 0%, transparent 70%)",
          animation: "glassBgFloat1 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-[15%] -left-[10%] h-[45%] w-[45%] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #03E1FF 0%, transparent 70%)",
          animation: "glassBgFloat2 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[30%] left-[60%] h-[30%] w-[30%] rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, #DC1FFF 0%, transparent 70%)",
          animation: "glassBgFloat3 15s ease-in-out infinite",
        }}
      />
    </div>
  );
}
