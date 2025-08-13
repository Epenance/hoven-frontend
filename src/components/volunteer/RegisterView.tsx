import { useState } from 'react';
import { registerUser } from '../../clients/strapi';
import type { RegisterData } from '../../clients/strapi';

interface RegisterViewProps {
    onBack: () => void;
}

export const RegisterView = ({onBack}: RegisterViewProps) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const validateForm = (): string | null => {
        if (!firstname.trim()) {
            return 'Fornavn er påkrævet';
        }
        if (!surname.trim()) {
            return 'Efternavn er påkrævet';
        }
        if (!email.trim()) {
            return 'Email er påkrævet';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Indtast en gyldig email adresse';
        }
        if (!password) {
            return 'Adgangskode er påkrævet';
        }
        if (password.length < 6) {
            return 'Adgangskode skal være mindst 6 tegn';
        }
        if (password !== confirmPassword) {
            return 'Adgangskoder stemmer ikke overens';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            const userData: RegisterData = {
                firstname: firstname.trim(),
                surname: surname.trim(),
                email: email.trim().toLowerCase(),
                password
            };

            const result = await registerUser(userData);

            if (result.success) {
                setIsRegistered(true);
            } else {
                setError(result.error || 'Der opstod en fejl ved oprettelse');
            }
        } catch (error) {
            setError('Der opstod en uventet fejl. Prøv igen senere.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <div className="text-center">
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="text-sm text-green-700">
                        <h3 className="font-medium text-green-800 mb-2">Tak for din oprettelse!</h3>
                        <p>Du kan logge ind når en administrator har godkendt din bruger.</p>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-jagt-600 hover:bg-jagt-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jagt-500"
                >
                    Tilbage til login
                </button>
            </div>
        );
    }

    return (
        <form className="mt-8 space-y-2" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstname" className="sr-only">
                    Fornavn
                </label>
                <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-jagt-500 focus:border-jagt-500 focus:z-10 sm:text-sm"
                    placeholder="Fornavn"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="surname" className="sr-only">
                    Efternavn
                </label>
                <input
                    id="surname"
                    name="surname"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-jagt-500 focus:border-jagt-500 focus:z-10 sm:text-sm"
                    placeholder="Efternavn"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="email" className="sr-only">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-jagt-500 focus:border-jagt-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">
                    Adgangskode
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-jagt-500 focus:border-jagt-500 focus:z-10 sm:text-sm"
                    placeholder="Adgangskode (min. 6 tegn)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="sr-only">
                    Gentag adgangskode
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-jagt-500 focus:border-jagt-500 focus:z-10 sm:text-sm"
                    placeholder="Gentag adgangskode"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

            <div className="mt-6 space-y-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-jagt-600 hover:bg-jagt-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jagt-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Opretter bruger...' : 'Opret bruger'}
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jagt-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tilbage
                </button>
            </div>
        </form>
    );
};

export default RegisterView;
