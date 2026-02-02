import { Logo } from './Logo';
import { ErrorMessage } from './ErrorMessage';

export function AuthForm({ 
  title, 
  subtitle, 
  error, 
  onErrorDismiss,
  children 
}) {
  return (
    <>
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showText={false} to="/landing" />
        </div>
        <h2 className="text-4xl font-bold gradient-text mb-3">{title}</h2>
        <p className="text-gray-400 text-lg">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-8">
          <ErrorMessage 
            message={error} 
            onDismiss={onErrorDismiss}
            dismissible={!!onErrorDismiss}
          />
        </div>
      )}

      {children}
    </>
  );
}