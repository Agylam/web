/**
 * @license Agylam
 * App.tsx
 * Facebook, продукт компании Meta, которая признана экстремистской организацией в России
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { JwtProvider } from "./context/jwt-context";

import "./css/themes.css";
import "./css/main.css";

export default function App() {
    return (
        <BrowserRouter>
            <React.StrictMode>
                <JwtProvider>
                    <AppRoutes />
                </JwtProvider>
            </React.StrictMode>
        </BrowserRouter>
    );
}
