import { cn } from '../../utils/cn';

export function LoadingSpinner({ 
  size = 'default', 
  className,
  text = 'Loading...' 
}) {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={cn(
        'animate-spin rounded-full border-b-2 border-orange-500',
        sizes[size],
        className
      )}></div>
      {text && (
        <p className="text-gray-400 text-lg">{text}</p>
      )}
    </div>
  );
}