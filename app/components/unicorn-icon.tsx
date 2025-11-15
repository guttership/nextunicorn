export function UnicornIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Horn */}
      <path d="M12 2 L11 8 L13 8 Z" fill="currentColor" />
      
      {/* Head */}
      <circle cx="12" cy="12" r="5" />
      
      {/* Ears */}
      <path d="M9 9 L8 5" />
      <path d="M15 9 L16 5" />
      
      {/* Eyes */}
      <circle cx="11" cy="11" r="0.8" fill="currentColor" />
      <circle cx="13" cy="11" r="0.8" fill="currentColor" />
      
      {/* Nose */}
      <path d="M12 13 L12 14" />
      
      {/* Mane */}
      <path d="M10 8 Q8 6 8 3" />
      <path d="M12 7 Q11 4 11 1" />
      <path d="M14 8 Q16 6 16 3" />
      
      {/* Neck */}
      <path d="M10 16 L10 20" />
      <path d="M14 16 L14 20" />
      
      {/* Front legs */}
      <path d="M10 20 L10 24" />
      <path d="M14 20 L14 24" />
    </svg>
  );
}
