import React, { useState, useEffect } from "react";
import cl from "../styles/Auth.module.css";
import {useNavigate} from 'react-router-dom'
import { MAIN_PAGE_ROUTE } from '../utils/consts'
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData") || "null"))
    const {setAuthenticationStatus} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (userData) {
            // Если у нас есть данные пользователя, считаем его авторизованным
            setAuthenticationStatus({
                isAuthenticated: true,
            })
        }
    }, [userData, setAuthenticationStatus])

    const handleAuth = async (e) => {
        e.preventDefault()
        const endpoint = isLogin ? "/login" : "/users/";
        const payload = isLogin
        && {username, password}

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            })

            const data = await response.json()
            if (response.ok) {
                if (isLogin) {
                    // Сохраняем данные пользователя в localStorage
                    localStorage.setItem("userData", JSON.stringify(data))
                    setUserData(data)
                    setAuthenticationStatus({
                        isAuthenticated: true,
                    })
                    navigate(MAIN_PAGE_ROUTE)
                } else {
                    alert("Регистрация успешна! Теперь войдите.")
                    setIsLogin(true)
                }
            } else {
                alert(data.detail || "Ошибка авторизации/регистрации")
            }
        } catch (error) {
            console.error("Ошибка при авторизации:", error)
            alert("Произошла ошибка при подключении к серверу")
        }
    }

    const logout = () => {
        localStorage.removeItem("userData")
        setUserData(null)
        setUsername("")
        setPassword("")
        setAuthenticationStatus({isAuthenticated: false, isAdmin: false})
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