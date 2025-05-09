import axios from 'axios'

const API_URL = 'http://localhost:3030'

export const loginUser = async (login, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {login, password})
        return response.data
    } catch (error) {
        console.error("Ошибка при входе:", error)
        throw error.response?.data || {message: "Ошибка подключения к серверу"}
    }
}

export const registerUser = async (login, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {login, password})
        return response.data
    } catch (error) {
        console.error("Ошибка при регистрации:", error)
        throw error.response?.data || {message: "Ошибка подключения к серверу"}
    }
}