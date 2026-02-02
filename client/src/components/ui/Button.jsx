import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  loading = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg hover:shadow-orange-500/30',
    secondary: 'glass-card text-gray-300 hover:text-orange-400 hover:bg-orange-500/10',
    ghost: 'text-gray-300 hover:text-orange-400 hover:bg-orange-500/10',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-red-500/30'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <button
      className={cn(
        'font-medium rounded-xl smooth-transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };