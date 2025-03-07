addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const response = await fetch(request);
    
    // Sadece 3xx yönlendirmelerini kontrol et
    if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('Location');
        if (location) {
            try {
                const siteUrl = new URL(request.url);
                const targetUrl = new URL(location, siteUrl.origin);
                
                // Harici domain kontrolü
                if (targetUrl.hostname !== siteUrl.hostname) {
                    const confirmUrl = new URL('https://www.darkarea.org/redirectConfirm.php');
                    confirmUrl.searchParams.set('url', targetUrl.toString());
                    return Response.redirect(confirmUrl.toString(), 302);
                }
            } catch (e) {
                // URL parse hatasında normal yönlendirmeye devam et
            }
        }
    }
    
    return response;
}