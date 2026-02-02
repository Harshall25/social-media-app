import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Logo({ 
  size = 'default', 
  showText = true, 
  className,
  to = '/'
}) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      container: 'w-8 h-8',
      text: 'text-lg'
    },
    default: {
      icon: 'w-6 h-6',
      container: 'w-10 h-10',
      text: 'text-2xl'
    },
    lg: {
      icon: 'w-8 h-8',
      container: 'w-12 h-12',
      text: 'text-3xl'
    }
  };

  const Component = to ? Link : 'div';
  const props = to ? { to } : {};

  return (
    <Component 
      {...props}
      className={cn(
        'flex items-center space-x-3 hover-lift cursor-pointer',
        className
      )}
    >
      <div className={cn(
        'bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center',
        sizes[size].container
      )}>
        <Users className={cn('text-white', sizes[size].icon)} />
      </div>
      {showText && (
        <span className={cn('font-bold gradient-text', sizes[size].text)}>
          Linkup
        </span>
      )}
    </Component>
  );
}