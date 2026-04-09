import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Keep existing anonymous logic for backward compatibility until user logs in
            const storedAlias = localStorage.getItem('userAlias');
            if (storedAlias) {
                 setUser({ alias: storedAlias, isAnonymous: true });
            }
        }
        setLoading(false);
    }, []);

    const login = (authData) => {
        // Handle new structured response {token, user: {...}} or old structure {...}
        const finalUserData = authData.token ? { ...authData.user, token: authData.token } : authData;
        setUser(finalUserData);
        localStorage.setItem('user', JSON.stringify(finalUserData));
        localStorage.setItem('userAlias', finalUserData.alias); // For components still using it
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userAlias');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
