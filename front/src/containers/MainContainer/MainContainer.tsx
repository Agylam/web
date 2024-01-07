import React, { Suspense } from "react";
import "./MainContainer.scss";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";
import { ToastContainer } from "react-toastify";
import useLocalStorage from "use-local-storage";
import { Spinner } from "../../components/Spinner/Spinner";
import { SWRConfig } from "swr";

interface MainContainerProps {
    children?: React.ReactNode;
}

export const MainContainer = (props: MainContainerProps) => {
    const [isLightTheme, setIsLightTheme] = useLocalStorage(
        "isLightTheme",
        !(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    const onChangeTheme = () => {
        setIsLightTheme(v => !v);
    };

    return (
        <SWRConfig value={{ suspense: true }}>
            <div className="main_container" data-theme={isLightTheme ? "light" : "dark"}>
                <Suspense fallback={<Spinner />}>
                    {props.children}
                </Suspense>
                <ThemeSwitcher
                    onChangeTheme={onChangeTheme}
                />
                <ToastContainer
                    limit={3}
                    theme={isLightTheme ? "light" : "dark"}
                    position="bottom-left"
                    autoClose={2000}
                />
            </div>
        </SWRConfig>
    );
};