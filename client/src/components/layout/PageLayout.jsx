import { FloatingOrbs } from '../ui/FloatingOrbs';

export function PageLayout({ children, showOrbs = true }) {
  return (
    <div className="min-h-screen grid-bg relative">
      {showOrbs && <FloatingOrbs />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}