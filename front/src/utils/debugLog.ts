export const debugLog = (...t: unknown[]) => {
    if (localStorage.debug === "true") {
        console.log(...t);
    }
};
