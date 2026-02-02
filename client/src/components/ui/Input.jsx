import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ 
  className, 
  type = 'text',
  label,
  error,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-lg font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6 group-focus-within:text-orange-400 smooth-transition" />
        )}
        <input
          type={type}
          className={cn(
            'w-full py-4 glass rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none smooth-transition text-white placeholder-gray-500 text-lg',
            Icon ? 'pl-14 pr-6' : 'px-6',
            error ? 'border-red-500 focus:ring-red-500' : '',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };