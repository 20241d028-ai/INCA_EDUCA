export default function Swoosh({ className = "", color = "var(--color-naranja)" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 12 Q 40 2, 75 10 T 150 9 T 198 6"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
