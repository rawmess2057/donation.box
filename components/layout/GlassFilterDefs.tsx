"use client";

import { useLiquidAnimation } from "@/hooks/useLiquidAnimation";
import { useRef } from "react";

export default function GlassFilterDefs() {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  useLiquidAnimation(turbulenceRef);

  return (
    <svg className="absolute -z-50 h-0 w-0" aria-hidden="true">
      <defs>
        <filter id="glass-liquid" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -4"
            in="noise"
            result="sharp"
          />
          <feSpecularLighting
            in="sharp"
            surfaceScale="3"
            specularConstant="0.6"
            specularExponent="20"
            result="specular"
          >
            <fePointLight x="50%" y="0%" z="200" />
          </feSpecularLighting>
          <feDisplacementMap
            in="SourceGraphic"
            in2="sharp"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feComposite
            operator="arithmetic"
            k1="1"
            k2="1"
            k3="0"
            k4="0"
            in="displaced"
            in2="specular"
          />
        </filter>

        <filter id="glass-intense" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -6"
            in="noise"
            result="sharp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="sharp"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="glass-subtle" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="1" result="noise" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -2"
            in="noise"
            result="sharp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="sharp"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
