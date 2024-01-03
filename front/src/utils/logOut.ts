export const logOut = () => {
    localStorage.removeItem("accessToken");
    window.location.pathname = "/";
};

