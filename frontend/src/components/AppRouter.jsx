import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../routes";
import { MAIN_PAGE_ROUTE } from "../utils/consts";
import { useAuth } from "../context/AuthContext";

const AppRouter = () => {
    const {isUserAuthenticated} = useAuth()

    return (
        <Routes>
            {isUserAuthenticated && privateRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}

            <Route path="*" element={<Navigate to={MAIN_PAGE_ROUTE} />} />
        </Routes>
    )
}

export default AppRouter