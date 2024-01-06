import React from "react";
import { PagePath, Role } from "../constants";
import IndexPage from "../pages/IndexPage/IndexPage";
import SchedulePage from "../pages/SchedulePage/SchedulePage";
import AnnouncementPage from "../pages/AnnouncementPage/AnnouncementPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthorizedContainer } from "../containers/AuthorizedContainer/AuthorizedContainer";


export const Routes: Route[] = [
    {
        path: PagePath.home,
        element: <IndexPage />,
        protected: false
    },
    {
        path: PagePath.schedule,
        element: <SchedulePage />,
        protected: true,
        roles: [Role.headteacher]
    },
    {
        path: PagePath.announcement,
        element: <AnnouncementPage />,
        protected: true,
        roles: [Role.headteacher]
    }
];

interface Route {
    path: PagePath;
    element?: React.ReactNode;
    protected?: boolean;
    roles?: Role[];
}

export const getRoutes = (roles: Role[], isAuthorized: boolean): RouteObject[] => {
    return Routes.map(route => {
        let element = route.element;
        if (route.protected) {
            if (!isAuthorized)
                element = <Navigate to="/" />;
            else
                element = <AuthorizedContainer>{route.element}</AuthorizedContainer>;
        }
        if (route.roles && !route.roles.some(role => roles.includes(role))) {
            element = <Navigate to="/" />;
        }

        return {
            ...route,
            element: element,
            errorElement: <ErrorPage />
        };
    });
};