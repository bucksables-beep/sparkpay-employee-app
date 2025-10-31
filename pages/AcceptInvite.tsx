import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SparkpayLogo: React.FC = () => (
    <svg height="24" viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary dark:text-white">
        <path d="M22.8443 23.3333L16.2996 12.02V23.3333H12.333V8.66666H16.2996L22.8443 19.98V8.66666H26.811V23.3333H22.8443Z" fill="currentColor"/>
        <path d="M42.228 23.3333H30.411V8.66666H42.228V12H34.3776V14.6667H41.5613V17.3333H34.3776V20.6667H42.228V23.3333Z" fill="currentColor"/>
        <path d="M51.8443 23.3333V8.66666H55.811V23.3333H51.8443Z" fill="currentColor"/>
        <path d="M68.5113 23.3333V14.52L63.5113 8.66666H68.2446L71.4113 12.9333L74.578 8.66666H79.3113L74.3113 14.52V23.3333H70.3446V16.4133L68.5113 14.28V23.3333H64.5446H68.5113Z" fill="currentColor"/>
        <path d="M89.7227 17.6533C89.7227 20.32 87.8893 23.3333 84.156 23.3333C80.4227 23.3333 78.5893 20.32 78.5893 17.6533C78.5893 14.9867 80.4227 12 84.156 12C87.8893 12 89.7227 14.9867 89.7227 17.6533ZM85.756 17.6533C85.756 16.2133 85.356 14.6667 84.156 14.6667C82.956 14.6667 82.556 16.2133 82.556 17.6533C82.556 19.0933 82.956 20.6667 84.156 20.6667C85.356 20.6667 85.756 19.0933 85.756 17.6533Z" fill="currentColor"/>
        <path d="M103.245 23.3333L96.6999 12.02V23.3333H92.7333V8.66666H96.6999L103.245 19.98V8.66666H107.211V23.3333H103.245Z" fill="currentColor"/>
        <path d="M117.844 23.3333V8.66666H121.811V23.3333H117.844Z" fill="currentColor"/>
        <path d="M129.811 23.3333V8.66666H138.711V11.3333H133.778V14.8533H138.045V17.52H133.778V20.6667H138.811V23.3333H129.811Z" fill="currentColor"/>
    </svg>
);

const PasswordInput: React.FC<{ 
    id: string; 
    name: string; 
    placeholder: string; 
    autoComplete: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, name, placeholder, autoComplete, value, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={isVisible ? 'text' : 'password'}
                autoComplete={autoComplete}
                required
                className="form-input mt-1 w-full rounded-lg border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark h-14 px-4 pr-12 focus:ring-2 focus:ring-inset focus:ring-primary"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-subtext-light dark:text-subtext-dark"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
            >
                <span className="material-symbols-outlined" aria-hidden="true">
                    {isVisible ? 'visibility_off' : 'visibility'}
                </span>
            </button>
        </div>
    );
};

const AcceptInvite: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [loginEmail, setLoginEmail] = useState('');
    const [password, setPassword] = useState('');

    const inviteCode = searchParams.get('inviteCode');
    const invitedEmail = searchParams.get('email');
    const orgName = "Sparkpay Inc.";

    useEffect(() => {
        if (invitedEmail) {
            setLoginEmail(invitedEmail);
        }
    }, [invitedEmail]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const apiRequestBody = {
            inviteCode,
            invitedEmail,
            loginEmail,
            password,
        };

        console.log('API Request Body:', apiRequestBody);

        navigate('/login', { state: { message: 'Account created successfully! Please sign in to continue.' } });
    };

    const handleSignInRedirect = () => {
        navigate('/login', { state: { message: `Please sign in to join ${orgName}.` } });
    };

    return (
        <div className="flex min-h-screen flex-col justify-center bg-background-light p-6 dark:bg-background-dark">
            <div className="mx-auto w-full max-w-sm">
                <div className="mb-6 flex justify-center">
                    <SparkpayLogo />
                </div>
                
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-3xl">
                        You're invited to join {orgName}
                    </h1>
                    <p className="mt-2 text-subtext-light dark:text-subtext-dark">
                        Create your account to get started.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="form-input mt-1 w-full rounded-lg border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark h-14 px-4 focus:ring-2 focus:ring-inset focus:ring-primary"
                        />
                        <p className="mt-2 text-xs text-subtext-light dark:text-subtext-dark">
                            We recommend using a personal email so you can access your Sparkpay account even after leaving the company.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark">Create Password</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold h-14 rounded-lg mt-4 text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale">
                        Create Account & Join
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-subtext-light dark:text-subtext-dark">
                    Already have an account?{' '}
                    <button onClick={handleSignInRedirect} className="font-semibold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AcceptInvite;
