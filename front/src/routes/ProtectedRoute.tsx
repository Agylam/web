import React, { FunctionComponent, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { PagePath } from "../constants";

type PrivateRouteProps = {
  allowed: boolean;
  redirectPathname?: string;
  children: ReactElement<any, any> | null;
};

export const ProtectedRoute: FunctionComponent<PrivateRouteProps> = ({
    allowed,
    redirectPathname = PagePath.home,
    children,
}) => {
    if (!allowed) {
        return <Navigate to={redirectPathname} replace />;
    }

    return children;
};
