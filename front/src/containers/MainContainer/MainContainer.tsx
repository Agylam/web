import React from "react";
import "./MainContainer.scss";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";
import { ToastContainer } from "react-toastify";
import useLocalStorage from "use-local-storage";

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
        <div className="main_container" data-theme={isLightTheme ? "light" : "dark"}>
            {props.children}
            <ThemeSwitcher
                onChangeTheme={onChangeTheme}
            />
            <ToastContainer
                limit={3}
                theme={isLightTheme ? "light" : "dark"}
            />
        </div>
    );
};