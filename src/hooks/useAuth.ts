// This file now re-exports the useAuth hook from the AuthContext
// to maintain backward compatibility with existing imports
export { useAuth, AuthProvider } from '../contexts/AuthContext';
export type { User } from '../contexts/AuthContext';

