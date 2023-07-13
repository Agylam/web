/**
 * @license Agylam
 * App.tsx
 * Facebook, продукт компании Meta, которая признана экстремистской организацией в России
 */

import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import "./css/color-light.css";
import "./css/main.css";

const IndexPage = lazy(() => import("./pages/IndexPage"));
const SchedulePage = lazy(() => import("./pages/SchedulePage"));
const AnnouncementPage = lazy(() => import("./pages/AnnouncementPage"));

import { Loader } from "./сomponents/Elements/Loader/Loader";
import { Error } from "./сomponents/Elements/Error/Error";

export default function App() {
    return (
        <ErrorBoundary fallback={<Error />}>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/announcement" element={<AnnouncementPage />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}