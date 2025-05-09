import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cl from "../styles/ArticlePage.module.css";
import CommentPost from "../components/CommentPost";
import plane from '../UI/icons/plane.svg';
import { fetchAllComments, addComment, detoxComment } from '../API/index';
import { formatDate } from '../utils/formatDate';
import cul from '../UI/icons/cul.svg';
import tech from '../UI/icons/tech.svg';
import soc from '../UI/icons/soc.svg';

const CATEGORY_STYLES = {
    1: cl.culture,
    2: cl.society,
    3: cl.technology,
};

const CATEGORY_NAMES = {
    1: "КУЛЬТУРА",
    2: "ОБЩЕСТВО",
    3: "ТЕХНОЛОГИИ",
};

const CATEGORY_IMAGES = {
    1: cul,
    2: soc,
    3: tech,
};

const ArticlePage = () => {
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(true)
    const {postId} = useParams()
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem("userData"))

    const [newComment, setNewComment] = useState("")

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return

        try {
            const detoxedComment = await detoxComment(newComment)
            let isCorrected = detoxedComment.trim() !== newComment.trim()

            const response = await addComment({
                text_comment: detoxedComment,
                user_id: userData.id,
                corrected_ai: isCorrected,
            })

            // Обновляем список комментариев
            setComments((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: detoxedComment,
                    user: userData.username,
                    timestamp: new Date().toISOString(),
                    aiEdited: isCorrected,
                },
            ])
            setNewComment("")
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error)
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await fetchAllComments();
                const withFallback = data.map((comment) => ({
                    id: comment.id,
                    text: comment.text || comment.text_comment || "",
                    user: userData.username,
                    timestamp: new Date().toISOString(),
                    aiEdited: comment.corrected || false,
                }))
                setComments(withFallback)
            } catch (e) {
                console.error("Ошибка при загрузке комментариев:", e)
            } finally {
                setLoadingComments(false)
            }
        }

        fetchComments()
    }, [])

    useEffect(() => {
        const mockPosts = JSON.parse(localStorage.getItem("mockPosts")) || []
        const foundPost = mockPosts.find((p) => p.id === parseInt(postId))
        setPost(foundPost || null)
    }, [postId])

    if (!post) {
        return <div className={cl.container}>Пост не найден</div>
    }

    return (
        <div className={cl.container}>
            <button onClick={() => navigate(-1)} className={cl.backButton}>
                ← Назад
            </button>
            <div className={`${cl.meta} ${CATEGORY_STYLES[post.category] || ""}`}>
                <span
                    className={`${cl.type} ${CATEGORY_STYLES[post.category] || ""}`}
                >
                    {CATEGORY_NAMES[post.category] || "Неизвестно"}
                </span>
            </div>
            <h1 className={cl.title}>{post.title}</h1>
            <img
                src={CATEGORY_IMAGES[post.category] || ""}
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
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className={cl.commentSubmitIcon} onClick={handleCommentSubmit}>
                        <img src={plane} alt="submit" />
                    </button>
                </div>
            </div>
            <div className={cl.commentsList}>
                {loadingComments ? (
                    <p>Загрузка комментариев...</p>
                ) : comments.length === 0 ? (
                    <p>Комментариев пока нет</p>
                ) : (
                    comments.map((comment) => (
                        <CommentPost
                            key={comment.id}
                            user={comment.user}
                            timestamp={formatDate(comment.timestamp)}
                            text={comment.text}
                            aiEdited={comment.aiEdited}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default ArticlePage