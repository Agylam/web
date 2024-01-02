import React from "react";
import { PagePath, Role } from "../constants";
import IndexPage from "../pages/IndexPage/IndexPage";
import SchedulePage from "../pages/SchedulePage";
import AnnouncementPage from "../pages/AnnouncementPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import type { RouteObject } from "react-router-dom";


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
        roles: [Role.director]
    },
    {
        path: PagePath.announcement,
        element: <AnnouncementPage />,
        protected: true,
        roles: [Role.director]
    }
];

interface Route {
    path: PagePath;
    element?: React.ReactNode;
    protected?: boolean;
    roles?: Role[];
}

export const getRoutes = (roles: Role[], isAuthorized: boolean): RouteObject[] => {
    return Routes.filter(route => {
        if (route.protected && !isAuthorized) return false;
        if (route.roles) {
            return route.roles.some(role => roles.includes(role));
        }
        return true;
    }).map(route => {
        return {
            ...route,
            errorElement: <ErrorPage />
        };
    });
};