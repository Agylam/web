import React, { FunctionComponent } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useJwtKeepAlive } from "../hooks/useJwtKeepAlive";
import { getRoutes } from "./RouterList";
import { useUserInfo } from "../hooks/useUserInfo";
import { debugLog } from "../utils/debugLog";

export const AppRoutes: FunctionComponent = () => {
    const userInfo = useUserInfo();
    const roles = userInfo?.rolesName || [];
    debugLog("userInfo", userInfo);

    const routes = getRoutes(roles, userInfo !== null);
    const router = createBrowserRouter(routes);

    debugLog("routes", routes);
    useJwtKeepAlive();

    return (
        <>
            <RouterProvider router={router} />
            <Outlet />
        </>
    );
};
