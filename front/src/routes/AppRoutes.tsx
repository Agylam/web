import React, { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import IndexPage from "../pages/IndexPage";
import SchedulePage from "../pages/SchedulePage";
import AnnouncementPage from "../pages/AnnouncementPage";
import { PagePath } from "../constants";
import { useJwtContext } from "../context/jwt-context";
import { useJwtKeepAlive } from "../hooks/useJwtKeepAlive";
import ThemeSwitcher from "../components/ThemeSwitcher/ThemeSwitcher";
import useLocalStorage from "use-local-storage";
import { ToastContainer } from "react-toastify";

export const AppRoutes: FunctionComponent = () => {
    // TODO: read to props (hasProtectedAccess)
    const { jwts } = useJwtContext();
    useJwtKeepAlive();
    const hasProtectedAccess = Boolean(jwts.accessToken);

    const [isLightTheme, setIsLightTheme] = useLocalStorage(
        "isLightTheme",
        !(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    return (
        <div className="main_container" data-theme={isLightTheme ? "light" : "dark"}>
            <Routes>
                <Route path={PagePath.home} element={<IndexPage />} />
                <Route
                    path={PagePath.schedule}
                    element={
                        <ProtectedRoute allowed={hasProtectedAccess}>
                            <SchedulePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={PagePath.announcement}
                    element={
                        <ProtectedRoute allowed={hasProtectedAccess}>
                            <AnnouncementPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <ThemeSwitcher
                onChangeTheme={() => {
                    setIsLightTheme((v) => !v);
                }}
            />

            <ToastContainer
                limit={3}
                theme={isLightTheme ? "light" : "dark"}
            />
        </div>
    );
};
