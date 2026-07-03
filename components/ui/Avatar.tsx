interface AvatarProps {
  address: string;
  size?: number;
  className?: string;
}

function hashToColor(seed: string, offset: number): string {
  let hash = 0;
  for (let i = offset; i < offset + 6 && i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export default function Avatar({
  address,
  size = 40,
  className = "",
}: AvatarProps) {
  const bg1 = hashToColor(address, 0);
  const bg2 = hashToColor(address, 4);

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
        fontSize: size * 0.4,
      }}
      title={address}
      aria-label={`Avatar for ${address.slice(0, 4)}...${address.slice(-4)}`}
    >
      {address.slice(2, 4).toUpperCase()}
    </div>
  );
}
