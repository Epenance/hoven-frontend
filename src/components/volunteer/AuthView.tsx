import { useState } from 'react';
import LoginView from "@/components/volunteer/LoginView.tsx";
import RegisterView from "@/components/volunteer/RegisterView.tsx";

interface LoginProps {
    onLogin: () => void;
}

export const AuthView = ({ onLogin }: LoginProps) => {
    const [currentScreen, setCurrentScreen] = useState<'login' | 'createUser' | 'forgotPassword'>('login');

    const handleRegisterButtonClick = () => {
        setCurrentScreen('createUser');
    }

    const handleBackButtonClick = () => {
        setCurrentScreen('login');
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Frivillig Portal
                    </h2>
                    {currentScreen === 'login' ? (<p className="mt-2 text-center text-sm text-gray-600">
                        Indtast adgangskode for at fortsætte
                    </p>) : null}
                    {currentScreen === 'createUser' ? (<p className="mt-2 text-center text-sm text-gray-600">
                        Indtast dine informationer for at oprette en ny bruger
                    </p>) : null}
                </div>
                {currentScreen === 'login' ? (
                    <LoginView onLogin={onLogin} onRegister={handleRegisterButtonClick} />
                ) : null}
                {currentScreen === 'createUser' ? (
                    <RegisterView onBack={handleBackButtonClick}  />
                ) : null}

            </div>
        </div>
    );
};


export default AuthView;