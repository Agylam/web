import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { AppRoutes } from "./routes/AppRoutes";
import { JwtProvider } from "./jwt-context";
import { MainContainer } from "./containers/MainContainer/MainContainer";

export default function App() {

    return (
        <React.StrictMode>
            <JwtProvider>
                <MainContainer>
                    <AppRoutes />
                </MainContainer>
            </JwtProvider>
        </React.StrictMode>
    );
}
