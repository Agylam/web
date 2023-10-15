/**
 * @license Agylam
 * App.tsx
 * Facebook, продукт компании Meta, которая признана экстремистской организацией в России
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { JwtProvider } from "./context/jwt-context";

import "./css/color-light.css";
import "./css/main.css";

const accessTokenCheckIntervalMs = 5000;

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
