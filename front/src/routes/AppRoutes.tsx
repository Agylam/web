import React, { FunctionComponent } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useJwtContext } from "../context/jwt-context";
import { useJwtKeepAlive } from "../hooks/useJwtKeepAlive";
import { getRoutes } from "./RouterList";

export const AppRoutes: FunctionComponent = () => {
    const { jwts } = useJwtContext();
    const routes = getRoutes([], !!jwts);
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
