import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get('session_token');

    if (event.url.pathname === '/') {
        if (sessionToken) {
            throw redirect(303, '/dashboard/users');
        } else {
            throw redirect(303, '/auth');
        }
    }

    if (event.url.pathname.startsWith('/dashboard')) {
        if (!sessionToken) {
            throw redirect(303, '/auth');
        }
    }

    if (event.url.pathname.startsWith('/auth') && sessionToken) {
         throw redirect(303, '/dashboard/users');
    }

    return resolve(event);
};