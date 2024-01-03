import React, { FunctionComponent } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useJwtKeepAlive } from "../hooks/useJwtKeepAlive";
import { getRoutes } from "./RouterList";
import { useUserInfo } from "../hooks/useUserInfo";

export const AppRoutes: FunctionComponent = () => {
    const userInfo = useUserInfo();
    const roles = userInfo?.rolesName || [];
    console.log("k", userInfo, roles);

    const routes = getRoutes(roles, userInfo !== null);

    console.log(routes);
    const router = createBrowserRouter(routes);

    useJwtKeepAlive();

    return (
        <>
            <RouterProvider router={router} />
            <Outlet />
        </>
    );
};
