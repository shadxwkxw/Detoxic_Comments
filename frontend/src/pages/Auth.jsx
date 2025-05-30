import React, { useState, useEffect } from "react";
import cl from "../styles/Auth.module.css";
import { useNavigate } from "react-router-dom";
import { MAIN_PAGE_ROUTE } from "../utils/consts";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from '../API/auth';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData") || "null"))
    const {setAuthenticationStatus} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (userData) {
            setAuthenticationStatus({isAuthenticated: true})
        }
    }, [userData, setAuthenticationStatus])

    const handleAuth = async (e) => {
        e.preventDefault()
    
        try {
            if (isLogin) {
                const data = await loginUser(username, password)
                const userObject = {username, id: data.id}
                localStorage.setItem("userData", JSON.stringify(userObject))
                setUserData(userObject)
                setAuthenticationStatus({isAuthenticated: true})
                navigate(MAIN_PAGE_ROUTE)
            } else {
                await registerUser(username, password)
                alert("Регистрация успешна! Теперь войдите.")
                setIsLogin(true)
            }
        } catch (err) {
            alert(err.message || "Ошибка авторизации/регистрации")
        }
    }   

    const logout = () => {
        localStorage.removeItem("userData")
        setUserData(null)
        setUsername("")
        setPassword("")
        setAuthenticationStatus({isAuthenticated: false})
    }

    return (
        <div className={cl.authContainer}>
            {userData ? (
                <div className={cl.loggedIn}>
                    <p>Вы авторизованы как <strong>{userData.username}</strong></p>
                    <button className={cl.loginButton} onClick={() => navigate(MAIN_PAGE_ROUTE)}>Продолжить</button>
                    <button className={cl.logoutButton} onClick={logout}>Выйти</button>
                </div>
            ) : (
                <form onSubmit={handleAuth} className={cl.authForm}>
                    <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={cl.inputField}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={cl.inputField}
                    />

                    <button type="submit" className={cl.authButton}>
                        {isLogin ? "Войти" : "Зарегистрироваться"}
                    </button>
                    <p className={cl.switchText} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
                    </p>
                </form>
            )}
        </div>
    )
}

export default Auth