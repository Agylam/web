import React from "react"

import "./Error.css"

export const Error = () => {

    const reloadHandler = () => {
        location.reload();
    }

    return (
        <div className="error">
            <h1 className="error__title">Error, please reload page</h1>
            <button className="error__button" onClick={reloadHandler}>Reload</button>
        </div>
    )
}