import React, { FunctionComponent, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import IndexPage from "../pages/IndexPage";
import SchedulePage from "../pages/SchedulePage";
import AnnouncementPage from "../pages/AnnouncementPage";
import { PagePath } from "../constants";
import { useJwtContext } from "../context/jwt-context";
import { useJwtKeepAlive } from "../hooks/useJwtKeepAlive";
import ThemeSwitcher from "../сomponents/ThemeSwitcher/ThemeSwitcher.js";

interface AppRoutesProps {
    //   hasProtectedAccess: boolean;
}

export const AppRoutes: FunctionComponent<AppRoutesProps> = (
    {
        // hasProtectedAccess,
    }
) => {
    // TODO: read to props (hasProtectedAccess)
    const { jwts } = useJwtContext();
    useJwtKeepAlive();
    const hasProtectedAccess = Boolean(jwts.accessToken);

    const [isLightTheme, setIsLightTheme] = useState(false);

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
                onClick={() => {
                    setIsLightTheme((v) => {
                        console.log(!v);
                        return !v;
                    });
                }}
            />
        </div>
    );
};
