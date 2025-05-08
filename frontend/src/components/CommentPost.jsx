import React from "react";
import cl from "../styles/CommentPost.module.css";
import star from "../UI/icons/star.svg"
import userLogo from '../UI/icons/user.png';

const CommentPost = ({timestamp, text, aiEdited, user}) => {
    return (
        <div className={cl.container}>
            <div className={cl.userBox}>
                <img className={cl.user} src={userLogo} alt="User" />
            </div>
            
            <div className={cl.metaInfo}>
                <div className={cl.metaInfo1}>
                    <div className={cl.header}>
                        <p>@{user}</p>
                        {aiEdited && (
                            <span className={cl.edited}>
                                <img src={star} alt="star" className={cl.starIcon} />
                                ИСПРАВЛЕНО ИИ
                            </span>
                        )}
                    </div>
                    <span className={cl.time}>{timestamp}</span>
                </div>
                <div className={cl.text}>
                    {text}
                </div>
            </div>
            
        </div>
    )
}

export default CommentPost