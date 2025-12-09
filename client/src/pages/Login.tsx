import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const payload: any = { email, password };
            if (step === 'otp') {
                payload.otp = otp;
            }

            const { data } = await api.post('/auth/login', payload);

            if (data.requireOtp) {
                setStep('otp');
                // Optional: Show success message that OTP was sent
            } else {
                login(data.token, { _id: data._id, name: data.name, email: data.email, role: data.role });
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        <Activity className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {step === 'credentials' ? 'Welcome back' : 'Verify Login'}
                    </h1>
                    <p className="text-slate-500">
                        {step === 'credentials'
                            ? 'Sign in to your Well-Link account'
                            : `Enter the code sent to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 'credentials' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="doctor@well-link.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                                    Remember me
                                </label>
                                <a href="#" className="text-primary hover:text-sky-600 font-medium">Forgot password?</a>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="input-field text-center text-2xl tracking-widest font-bold"
                                placeholder="123456"
                                maxLength={6}
                                required
                                autoFocus
                            />
                            <p className="text-xs text-center text-slate-500 mt-4">
                                Didn't receive code? <button type="button" onClick={() => setStep('credentials')} className="text-primary font-medium">Try again</button>
                            </p>
                        </div>
                    )}

                    <button type="submit" className="w-full btn-primary py-3">
                        {step === 'credentials' ? 'Sign In' : 'Verify & Login'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
