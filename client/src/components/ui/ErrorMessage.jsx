import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

export function ErrorMessage({ 
  message, 
  onDismiss,
  dismissible = false,
  className 
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !message) return null;

  return (
    <div className={cn(
      'bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm flex items-center gap-3',
      className
    )}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {dismissible && (
        <button 
          onClick={handleDismiss}
          className="text-red-400 hover:text-red-300 smooth-transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}