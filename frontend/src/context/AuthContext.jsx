import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

    useEffect(() => {
        const userData = localStorage.getItem("userData")
        if (userData) {
            setIsUserAuthenticated(true)
        }
    }, [])

    const setAuthenticationStatus = ({isAuthenticated}) => {
        setIsUserAuthenticated(isAuthenticated)
    }

    return (
        <AuthContext.Provider value={{isUserAuthenticated, setAuthenticationStatus}}>
            {children}
        </AuthContext.Provider>
    )
}