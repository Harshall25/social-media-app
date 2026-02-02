import { FloatingOrbs } from '../ui/FloatingOrbs';
import { Card } from '../ui/Card';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-6 relative overflow-hidden">
      <FloatingOrbs />
      <Card className="w-full max-w-lg relative z-10 scale-in">
        {children}
      </Card>
    </div>
  );
}