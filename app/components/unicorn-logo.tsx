export function UnicornLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horn */}
      <path
        d="M100 10L95 50L105 50Z"
        fill="url(#hornGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Head */}
      <circle cx="100" cy="80" r="35" fill="white" stroke="currentColor" strokeWidth="2" />

      {/* Snout */}
      <ellipse cx="100" cy="95" rx="18" ry="15" fill="white" stroke="currentColor" strokeWidth="2" />

      {/* Eyes */}
      <circle cx="92" cy="72" r="4" fill="currentColor" />
      <circle cx="108" cy="72" r="4" fill="currentColor" />

      {/* Eye shine */}
      <circle cx="93" cy="71" r="1.5" fill="white" />
      <circle cx="109" cy="71" r="1.5" fill="white" />

      {/* Nostrils */}
      <circle cx="96" cy="98" r="2" fill="currentColor" />
      <circle cx="104" cy="98" r="2" fill="currentColor" />

      {/* Mouth */}
      <path
        d="M100 100 Q95 105 92 103"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Mane */}
      <path
        d="M75 55 Q70 40 75 25"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M85 50 Q82 32 88 15"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M105 48 Q110 30 108 12"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M120 52 Q128 38 132 20"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Ears */}
      <path
        d="M80 55 Q75 48 78 38"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M120 55 Q125 48 122 38"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Neck */}
      <path
        d="M85 110 Q80 130 82 150"
        stroke="currentColor"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M100 115 Q100 135 100 155"
        stroke="currentColor"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M115 110 Q120 130 118 150"
        stroke="currentColor"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />

      {/* Body */}
      <ellipse cx="100" cy="160" rx="30" ry="25" fill="white" stroke="currentColor" strokeWidth="2" />

      {/* Front legs */}
      <line x1="90" y1="180" x2="88" y2="195" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="110" y1="180" x2="112" y2="195" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Tail */}
      <path
        d="M128 155 Q145 150 150 140"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="hornGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="rgb(236, 72, 153)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
