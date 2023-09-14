import React, { FunctionComponent } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import IndexPage from "../pages/IndexPage";
import SchedulePage from "../pages/SchedulePage";
import AnnouncementPage from "../pages/AnnouncementPage";
import { PagePath } from "../constants";
import { useJwtContext } from "../context/jwt-context";
import { useJwtKeepAlive } from "../hooks/useJwtKeepAlive";

interface AppRoutesProps {
//   hasProtectedAccess: boolean;
}

export const AppRoutes: FunctionComponent<AppRoutesProps> = ({
    // hasProtectedAccess,
}) => {
    // TODO: read to props (hasProtectedAccess)
    const { jwts } = useJwtContext();
    useJwtKeepAlive();
    const hasProtectedAccess = Boolean(jwts.accessToken && jwts.refreshToken);
    return (
        <Routes>
            <Route path={PagePath.home} element={<IndexPage />} />
            <Route path={PagePath.schedule}
                element={
                    <ProtectedRoute allowed={hasProtectedAccess}>
                        <SchedulePage />
                    </ProtectedRoute>
                }
            />
            <Route path={PagePath.announcement}
                element={
                    <ProtectedRoute allowed={hasProtectedAccess}>
                        <AnnouncementPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};
