import { POSTS_ROUTE, AUTH_ROUTE, MAIN_PAGE_ROUTE, PROFILE_ROUTE } from "./utils/consts";
import Auth from './pages/Auth'
import MainPage from "./pages/MainPage";
import ArticlePage from "./pages/ArticlePage"
import Profile from "./pages/Profile";

export const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component: Auth
    },
]

export const privateRoutes = [   
    {
        path: POSTS_ROUTE,
        Component: ArticlePage
    },

    {
        path: PROFILE_ROUTE,
        Component: Profile
    },

    {
        path: MAIN_PAGE_ROUTE,
        Component: MainPage
    }
]