import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import cl from "../styles/Navbar.module.css";
import kolpaknews from '../UI/icons/kolpaknews.svg';
import { AUTH_ROUTE, MAIN_PAGE_ROUTE, PROFILE_ROUTE } from "../utils/consts";

const Navbar = () => {
    const navigate = useNavigate()
    const {isUserAuthenticated} = useAuth()

    return (
        <nav className={cl.navbar}>
            <div className={cl.logo} onClick={() => navigate(MAIN_PAGE_ROUTE)}>
                <img src={kolpaknews} alt="Logo" className={cl.logo} />
            </div>

            <div className={cl.buttons}>
                {isUserAuthenticated ? (
                    <button className={cl.publishBtn} onClick={() => navigate(PROFILE_ROUTE)}>
                        Личный кабинет
                    </button>
                ) : (
                    <button className={cl.publishBtn} onClick={() => navigate(AUTH_ROUTE)}>
                        Войти в аккаунт
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar