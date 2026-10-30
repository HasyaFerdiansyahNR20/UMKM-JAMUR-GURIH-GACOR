import React from "react";

export const WavyDivider: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden leading-none z-10 -mt-1">
      <svg
        className="relative block w-full h-12 sm:h-20 lg:h-24 text-white"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,60 C650,150 900,10 1200,40 L1200,120 L0,120 Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
};
