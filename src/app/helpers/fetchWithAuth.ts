export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const headers = new Headers(options.headers);

    if(token){
        headers.set("Authorization",`Bearer ${token}`);
    }

    return fetch(url, {...options, headers});
}