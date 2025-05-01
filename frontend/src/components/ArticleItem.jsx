import React from "react";
import { useNavigate } from "react-router-dom";
import cl from "../styles/ArticleItem.module.css";

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

    return (
        <>
            {posts.map(post => (
                <div key={post.id} className={cl.card}>
                    <img
                        src='https://s3-alpha-sig.figma.com/img/4839/25f5/f5ce79046feb6f45b58ab338b1b00fd2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IKpgYQRa5TCsGMp68SlmTPJFBNpdeaa9CT4Gzu3AGIhW9RXALcw23sY5IFg-PrGMaADu-r9VZVw1zGv8F~~1iYJzbFgGMe2ejtWhUNvcoVb32Q8F80AGJDXHdpaIEvcyjsTJyZsPPT0RzZKZzTBOV9QQrhNanTqYS-VDp5DeJIAXaC7vjy9v4Gp9hmiUCTs0iSYcpnUbYvLTfgXagrVH~Q5Che60YCXf1ZRN5D1PSYWUJXTH05yr1T2g-vh4qunC-ieXtDUWu2YXIQXoac6kJz9LcEAYon0gRMv5ZW2sYKaiOKWv7cXzJanYfk~QC~HKWzTFFfZqsYMUeqzPF2-WVw__'
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
                    <button
                        onClick={() => handleReadMore(post.id)}
                        className={cl.readMore}
                    >
                        Читать
                    </button>
                </div>
            ))}
        </>
    )
}

export default ArticleItem