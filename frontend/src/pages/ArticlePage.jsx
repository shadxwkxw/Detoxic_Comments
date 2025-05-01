import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cl from "../styles/ArticlePage.module.css";
import CommentPost from "../components/CommentPost";
import plane from '../UI/icons/plane.svg'

const CATEGORY_STYLES = {
    1: cl.culture,
    2: cl.society,
    3: cl.technology,
}

const CATEGORY_NAMES = {
    1: "КУЛЬТУРА",
    2: "ОБЩЕСТВО",
    3: "ТЕХНОЛОГИИ",
}

const mockComments = [
    {
        id: 1,
        user: "denchikAI",
        timestamp: "47 минут назад",
        text: "Очень серьезный текст очень важного комментария",
        aiEdited: true
    },
    {
        id: 2,
        user: "denchikAI",
        timestamp: "2 часа назад",
        text: "Этот комментарий остался без изменений",
        aiEdited: false
    },
    {
        id: 3,
        user: "denchikAI",
        timestamp: "1 день назад",
        text: "ИИ помог улучшить структуру предложения в этом комментарии",
        aiEdited: true
    }
]

const ArticlePage = () => {
    const [post, setPost] = useState(null)
    const {postId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const mockPosts = JSON.parse(localStorage.getItem("mockPosts")) || []
        const foundPost = mockPosts.find(p => p.id === parseInt(postId))
        setPost(foundPost || null)
    }, [postId])

    if (!post) {
        return <div className={cl.container}>Пост не найден</div>;
    }

    return (
        <div className={cl.container}>
            <button onClick={() => navigate(-1)} className={cl.backButton}>← Назад</button>
            <div className={`${cl.meta} ${CATEGORY_STYLES[post.category] || ""}`}>
                <span className={`${cl.type} ${CATEGORY_STYLES[post.category] || ""}`}>
                    {CATEGORY_NAMES[post.category] || "Неизвестно"}
                </span>
            </div>
            <h1 className={cl.title}>{post.title}</h1>
            <img
                src="https://s3-alpha-sig.figma.com/img/4839/25f5/f5ce79046feb6f45b58ab338b1b00fd2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IKpgYQRa5TCsGMp68SlmTPJFBNpdeaa9CT4Gzu3AGIhW9RXALcw23sY5IFg-PrGMaADu-r9VZVw1zGv8F~~1iYJzbFgGMe2ejtWhUNvcoVb32Q8F80AGJDXHdpaIEvcyjsTJyZsPPT0RzZKZzTBOV9QQrhNanTqYS-VDp5DeJIAXaC7vjy9v4Gp9hmiUCTs0iSYcpnUbYvLTfgXagrVH~Q5Che60YCXf1ZRN5D1PSYWUJXTH05yr1T2g-vh4qunC-ieXtDUWu2YXIQXoac6kJz9LcEAYon0gRMv5ZW2sYKaiOKWv7cXzJanYfk~QC~HKWzTFFfZqsYMUeqzPF2-WVw__"
                alt="Article"
                className={cl.image}
            />
            <div className={cl.content}>
                {post.content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
            <hr className={cl.hr} />
            <h1>Обсуждение</h1>
            <div className={cl.commentInputContainer}>
                <div className={cl.commentInputWrapper}>
                    <textarea
                        className={cl.commentInput}
                        placeholder="Ваш комментарий..."
                        rows="3"
                    />
                    <button className={cl.commentSubmitIcon}>
                        <img src={plane} />
                    </button>
                </div>
            </div>
            <div className={cl.commentsList}>
                {mockComments.map(comment => (
                    <CommentPost
                        key={comment.id}
                        user={comment.user}
                        timestamp={comment.timestamp}
                        text={comment.text}
                        aiEdited={comment.aiEdited}
                    />
                ))}
            </div>
        </div>
    )
}

export default ArticlePage