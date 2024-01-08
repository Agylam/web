export const debugLog = (...t: any[]) => {
    if (localStorage.debug === "true") {
        console.log(...t);
    }
};