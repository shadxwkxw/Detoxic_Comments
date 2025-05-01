import React from "react";
import cl from "../styles/Comment.module.css";
import star from "../UI/icons/star.svg"

const Comment = ({timestamp, text, aiEdited}) => {
    return (
        <div className={cl.container}>
            <div className={cl.header}>
                <span className={cl.time}>{timestamp}</span>
                {aiEdited && (
                    <span className={cl.edited}>
                        <img src={star} alt="star" className={cl.starIcon} />
                        ИСПРАВЛЕНО ИИ
                    </span>
                )}
            </div>
            <div className={cl.text}>
                {text}
            </div>
        </div>
    )
}

export default Comment