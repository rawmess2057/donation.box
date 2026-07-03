export default function GlassFilterDefs() {
  return (
    <svg className="absolute -z-50 h-0 w-0" aria-hidden="true">
      <defs>
        <filter id="glass-subtle" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 8 -3"
            in="noise"
            result="sharpNoise"
          />
          <feDisplacementMap in="SourceGraphic" in2="sharpNoise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="glass-medium" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -5"
            in="noise"
            result="sharpNoise"
          />
          <feDisplacementMap in="SourceGraphic" in2="sharpNoise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="glass-heavy" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -6"
            in="noise"
            result="sharpNoise"
          />
          <feDisplacementMap in="SourceGraphic" in2="sharpNoise" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
