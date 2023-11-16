import React from "react";

import "./ThemeSwitcher.css";

import sun from "../../assets/sun.svg";

export default function ThemeSwitcher({ onChangeTheme }: { onChangeTheme: () => void }) {
    return (
        <button className="theme_switcher" onClick={onChangeTheme}>
            <img src={sun} alt="" id="theme_icon" />
        </button>
    );
}
