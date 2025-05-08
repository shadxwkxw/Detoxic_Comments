import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToxicMeter from "../components/ToxicMeter";
import { useAuth } from "../context/AuthContext";
import cl from "../styles/Profile.module.css";
import userLogo from '../UI/icons/user.png';
import { AUTH_ROUTE } from "../utils/consts";
import Comment from "../components/Comment";

const Profile = () => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData") || "null"));
    const [comments, setComments] = useState([]);
    const { setAuthenticationStatus } = useAuth();
    const navigate = useNavigate();

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }    

    useEffect(() => {
        if (!userData) return;

        fetch(`http://localhost:3030/comments/${userData.id}`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error("Ошибка загрузки комментариев:", err));
    }, [userData]);

    const changed = comments.filter(comment => comment.corrected).length;
    const total = comments.length;
    const perc = total === 0 ? 0 : Math.floor((changed / total) * 100);

    const handleLogout = () => {
        localStorage.removeItem("userData");
        setAuthenticationStatus({ isAuthenticated: false });
        navigate(AUTH_ROUTE);
    };

    return (
        <div className={cl.profile}>
            <h1>ЛИЧНЫЙ КАБИНЕТ</h1>

            <div className={cl.profileInfo}>
                <div className={cl.userBox}>
                    <img className={cl.user} src={userLogo} alt="User" />
                </div>
            </div>

            <div className={cl.metaInfo}>
                <div className={cl.username}>@{userData?.username}</div>
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
                {comments.map(comment => (
                    <Comment
                        key={comment.id}
                        timestamp={formatDate(comment.timestamp)}
                        text={comment.text}
                        aiEdited={comment.corrected}
                    />
                ))}
            </div>
        </div>
    )
}

export default Profile