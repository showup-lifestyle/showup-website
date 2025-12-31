export function SymmetryIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4">
      <line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" stroke-width="2"/>
      <line className="animate-scale-x" x1="50" y1="80" x2="50" y2="20" stroke="currentColor" stroke-width="2"/>
      <circle className="animate-bounce-delay-0" cx="30" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle className="animate-bounce-delay-1" cx="70" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" stroke-width="2"/>
    </svg>
  );
}