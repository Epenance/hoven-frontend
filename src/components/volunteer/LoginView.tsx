import { useState } from 'react';
const VOLUNTEER_PASSWORD = import.meta.env.PUBLIC_VOLUNTEER_PASSWORD;

interface LoginViewProps {
    onLogin: () => void;
    onRegister: () => void;
}
export const LoginView = ({onLogin, onRegister}: LoginViewProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate a small delay for better UX
        setTimeout(() => {
            if (password === VOLUNTEER_PASSWORD) {
                onLogin();
            } else {
                setError('Forkert adgangskode');
                setPassword('');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="password" className="sr-only">
                    Adgangskode
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-jagt-500 focus:border-jagt-500 focus:z-10 sm:text-sm"
                    placeholder="Adgangskode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">
                        {error}
                    </div>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-jagt-600 hover:bg-jagt-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jagt-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : null}
                    {isLoading ? 'Logger ind...' : 'Log ind'}
                </button>
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={onRegister}
                    className="mt-2 cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-jagt-600 hover:bg-jagt-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jagt-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >Opret bruger</button>
            </div>
        </form>
    )
}

export default LoginView