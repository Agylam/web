/**
 * @license Agylam
 * App.tsx
 * Facebook, продукт компании Meta, которая признана экстремистской организацией в России
 */

import React from "react";
import { Route, Routes } from "react-router-dom";
import "./css/color-light.css";

import "./css/main.css";
import IndexPage from "./pages/IndexPage";
import SchedulePage from "./pages/SchedulePage";
import AnnouncementPage from "./pages/AnnouncementPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/announcement" element={<AnnouncementPage />} />
        </Routes>
    );
}
