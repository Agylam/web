const a = async () => {
    const resp = await fetch('https://mp3uks.ru/mp3/files/rizza-sqwore-plach-mp3.mp3', {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain',
            Authorization: 'Bearer ',
        },
        redirect: 'follow',
    });
    console.log(await resp.arrayBuffer());
};
a();
