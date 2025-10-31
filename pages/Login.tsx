import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    const handleLogin = () => {
        // Simulate login and navigate to dashboard
        navigate('/app/dashboard');
    };

    return (
        <div className="flex flex-col h-screen justify-center p-6">
            <div className="flex-grow flex flex-col justify-center">
                <div className="flex w-full items-center justify-center gap-2 mb-8">
                    <div className="h-2 w-8 rounded-full bg-primary"></div>
                    <div className="h-2 w-8 rounded-full bg-primary/20 dark:bg-primary/30"></div>
                    <div className="h-2 w-8 rounded-full bg-primary/20 dark:bg-primary/30"></div>
                </div>
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-light dark:text-text-dark">Welcome to Sparkpay</h1>
                    <p className="text-subtext-light dark:text-subtext-dark max-w-sm mx-auto">
                        Your all-in-one financial hub for seamless transactions and smart money management.
                    </p>
                </div>
                
                {message && (
                    <div className="mb-6 rounded-lg bg-primary/10 dark:bg-accent-blue/20 p-4 text-center text-sm font-medium text-primary dark:text-accent-blue">
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email or Phone</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark" aria-hidden="true">mail</span>
                            <input id="email" name="email" className="form-input w-full rounded-lg border-0 bg-background-light dark:bg-surface-dark h-14 pl-12 pr-4 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-2 focus:ring-inset focus:ring-primary" placeholder="Email or Phone" type="email"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark" aria-hidden="true">lock</span>
                            <input id="password" name="password" className="form-input w-full rounded-lg border-0 bg-background-light dark:bg-surface-dark h-14 pl-12 pr-4 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-2 focus:ring-inset focus:ring-primary" placeholder="Password" type="password"/>
                        </div>
                    </div>
                </div>
                <a className="text-sm text-primary font-medium text-right mt-4 block" href="#">Forgot Password?</a>
                <button 
                    onClick={handleLogin}
                    className="w-full bg-primary text-white font-bold h-14 rounded-lg mt-8 text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale">
                    Log In
                </button>
            </div>
        </div>
    );
};

export default Login;