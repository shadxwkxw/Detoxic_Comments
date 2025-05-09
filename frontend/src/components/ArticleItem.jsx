import React from "react";
import { useNavigate } from "react-router-dom";
import cl from "../styles/ArticleItem.module.css";
import cul from '../UI/icons/cul.svg';
import tech from '../UI/icons/tech.svg';
import soc from '../UI/icons/soc.svg';

const CATEGORY_MAPPING = {
    "КУЛЬТУРА": 1,
    "ОБЩЕСТВО": 2,
    "ТЕХНОЛОГИИ": 3,
}

const ArticleItem = ({posts = []}) => {
    const navigate = useNavigate()

    const handleReadMore = (postId) => {
        navigate(`/posts/${postId}`)
    }

    const getCategoryImage = (categoryId) => {
        switch (categoryId) {
            case 1:
                return cul
            case 2:
                return soc
            case 3:
                return tech
            default:
                return null
        }
    }

    return (
        <>
            {posts.map(post => (
                <div key={post.id} className={cl.card} onClick={() => handleReadMore(post.id)}>
                    <img
                        src={getCategoryImage(post.category)}
                        alt="Article"
                        className={cl.image}
                    />
                    <div className={cl.labels}>
                        <span className={cl.label}>
                            {
                                Object.entries(CATEGORY_MAPPING).find(
                                    ([name, id]) => id === post.category
                                )?.[0] || "Неизвестно"
                            }
                        </span>
                    </div>
                    <h3 className={cl.title}>{post.title}</h3>
                    <button className={cl.readMore}>
                        Читать
                    </button>
                </div>
            ))}
        </>
    )
}

export default ArticleItem