import React from "react";

import "./ThemeSwitcher.css";

export default function ThemeSwitcher({ onClick }: { onClick: () => void }) {
    return (
        <div className="theme_switcher" onClick={() => onClick()}>
            <input id="theme_switch_input" type="checkbox" className="theme" />
            <label htmlFor="theme_switch_input">
                <svg
                    id="theme_icon"
                    width="800px"
                    height="800px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                >
                    <circle
                        cx="16"
                        cy="16"
                        r="6"
                        stroke="#535358"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    />
                    <path
                        stroke="#535358"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 6V3M8.929 8.929L6.808 6.808M6 16H3M16 29v-3M25.192 25.192l-2.121-2.121M29 16h-3M8.929 23.071l-2.121 2.121M25.192 6.808l-2.12 2.121"
                    />
                </svg>
            </label>
        </div>
    );
}
