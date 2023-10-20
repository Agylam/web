export const fetcher = async ([uri, token = ""]: string[]) => {
    const unparsed_resp = await fetch("/api/" + uri, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!unparsed_resp.ok) {
        throw new Error("An error occurred while fetching the data.");
    }

    const resp = await unparsed_resp.json();

    if (resp.error !== undefined) {
        throw new Error(resp.message);
    }

    return resp.result || resp;
};
