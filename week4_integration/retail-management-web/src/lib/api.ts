import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';
import { browser } from '$app/environment';

export async function fetchFromGo(endpoint: string, options: RequestInit = {}) {
    const url = `${PUBLIC_API_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': PUBLIC_API_KEY,
        ...((options.headers as Record<string, string>) || {})
    };

    if (browser) {
        const token = getCookie('session_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
}

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}