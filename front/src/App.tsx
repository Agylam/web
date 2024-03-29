import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { AppRoutes } from "./routes/AppRoutes";
import { MainContainer } from "./containers/MainContainer/MainContainer";

export const App = () => {
    return (
        <React.StrictMode>
            <MainContainer>
                <AppRoutes />
            </MainContainer>
        </React.StrictMode>
    );
};
