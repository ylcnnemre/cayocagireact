import { createContext, useContext } from 'react';
import { useAuth } from './useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { currentUser, loading } = useAuth();

    return (
        <AuthContext.Provider value={{
            currentUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
const useAuthContext = () => useContext(AuthContext);

export {
    useAuthContext
}