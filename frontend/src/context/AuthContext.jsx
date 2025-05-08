import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetch("http://localhost:3000/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.is_admin === true) {
                        setIsUserAuthenticated(true)
                    } else {
                        setIsUserAuthenticated(true)
                    }
                })
                .catch(() => {
                    setIsUserAuthenticated(false)
                })
        }
    }, [])

    const setAuthenticationStatus = (status) => {
        setIsUserAuthenticated(status.isAuthenticated)
    }

    return (
        <AuthContext.Provider value={{isUserAuthenticated, setIsUserAuthenticated, setAuthenticationStatus}}>
            {children}
        </AuthContext.Provider>
    )
}