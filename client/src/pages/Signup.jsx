import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AuthForm } from '../components/ui/AuthForm';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await signup(name, email, password);
            alert('Account created successfully! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthForm
                title="Join Linkup"
                subtitle="Create your account and start connecting"
                error={error}
                onErrorDismiss={() => setError('')}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        icon={User}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        icon={Mail}
                    />

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="••••••••"
                            icon={Lock}
                        />
                        <p className="text-sm text-gray-500 mt-2">Minimum 6 characters required</p>
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        size="lg"
                        className="w-full"
                    >
                        <UserPlus className="w-5 h-5" />
                        Create Account
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-lg">
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange-400 hover:text-orange-300 smooth-transition font-semibold flex items-center justify-center gap-2 mt-2">
                            <ArrowLeft className="w-4 h-4" />
                            Sign In
                        </Link>
                    </p>
                </div>
            </AuthForm>
        </AuthLayout>
    );
}