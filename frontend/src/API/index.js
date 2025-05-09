import axios from 'axios'

const API_BASE = 'http://localhost:3030'
const DETOX_API = 'http://localhost:5000'

export const fetchAllComments = async () => {
    try {
        const res = await axios.get(`${API_BASE}/comments`)
        return res.data
    } catch (error) {
        console.error("Ошибка загрузки комментариев:", error)
        return []
    }
}

export const addComment = async (commentData) => {
    try {
        const res = await axios.post(`${API_BASE}/comment`, commentData)
        return res.data
    } catch (error) {
        console.error("Ошибка добавления комментария:", error)
        return {corrected: false}
    }
}

export const detoxComment = async (text) => {
    try {
        const res = await axios.post(`${DETOX_API}/detox`, {text})
        return res.data.detoxed_text || text
    } catch (error) {
        console.error("Ошибка детоксикации текста:", error)
        return text
    }
}

export const fetchUserComments = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE}/comments/${userId}`)
        return res.data
    } catch (error) {
        console.error("Ошибка загрузки комментариев пользователя:", error)
        return []
    }
}