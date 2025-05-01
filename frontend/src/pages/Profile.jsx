import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToxicMeter from "../components/ToxicMeter";
import { useAuth } from "../context/AuthContext";
import cl from "../styles/Profile.module.css";
import userLogo from '../UI/icons/user.png';
import { AUTH_ROUTE } from "../utils/consts";
import Comment from "../components/Comment";

const Profile = () => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData") || "null"))
    const { setAuthenticationStatus } = useAuth()
    const navigate = useNavigate()

    const changed = 48
    const total = 100
    const perc = total === 0 ? 0 : Math.floor((changed / total) * 100)

    const mockComments = [
        {
            id: 1,
            timestamp: "47 минут назад",
            text: "Очень серьезный текст очень важного комментария",
            aiEdited: true
        },
        {
            id: 2,
            timestamp: "2 часа назад",
            text: "Этот комментарий остался без изменений",
            aiEdited: false
        },
        {
            id: 3,
            timestamp: "1 день назад",
            text: "ИИ помог улучшить структуру предложения в этом комментарии",
            aiEdited: true
        }
    ]

    const handleLogout = () => {
        localStorage.removeItem("userData");
        setAuthenticationStatus({ isAuthenticated: false })
        navigate(AUTH_ROUTE)
    }

    return (
        <div className={cl.profile}>
            <h1>ЛИЧНЫЙ КАБИНЕТ</h1>

            <div className={cl.profileInfo}>
                <div className={cl.userBox}>
                    <img className={cl.user} src={userLogo} alt="User" />
                </div>
            </div>

            <div className={cl.metaInfo}>
                <div className={cl.username}>@{userData.username}</div>
                <div className={cl.logout} onClick={handleLogout}>Выйти</div>
            </div>

            <div className={cl.statsBox}>
                <div className={cl.statBox}>
                    <div className={cl.statNumber}>{total}</div>
                    <div className={cl.statLabel}>КОММЕНТАРИЕВ</div>
                </div>
                <div className={cl.statBox}>
                    <div className={cl.statNumber}>{changed}</div>
                    <div className={cl.statLabel}>ИСПРАВЛЕНО ИИ</div>
                </div>
                <div className={cl.statBox}>
                    <div className={cl.statNumber}>{total - changed}</div>
                    <div className={cl.statLabel}>БЕЗ ИЗМЕНЕНИЙ</div>
                </div>
            </div>

            <div className={cl.meter}>
                <ToxicMeter percentage={perc} />
            </div>

            <hr className={cl.hr} />

            <h1>История</h1>

            <div className={cl.commentsList}>
                {mockComments.map(comment => (
                    <Comment
                        key={comment.id}
                        timestamp={comment.timestamp}
                        text={comment.text}
                        aiEdited={comment.aiEdited}
                    />
                ))}
            </div>
        </div>
    )
}

export default Profile;
