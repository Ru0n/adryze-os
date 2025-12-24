import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData } from '@/types';

const secretPassword = process.env.SECRET_COOKIE_PASSWORD;

if (!secretPassword || secretPassword.length < 32) {
    console.warn(
        'Warning: SECRET_COOKIE_PASSWORD is not set or too short. Using a fallback for development.'
    );
}

// Session configuration
export const sessionOptions: SessionOptions = {
    password: secretPassword && secretPassword.length >= 32
        ? secretPassword
        : 'complex_password_at_least_32_characters_long_1234567890',
    cookieName: 'adryze_os_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    },
};

/**
 * Get the current session
 */
export async function getSession(): Promise<IronSession<SessionData>> {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session.isLoggedIn === true && !!session.uid;
}

/**
 * Get current user's UID and password from session
 */
export async function getSessionCredentials(): Promise<{ uid: number; password: string; username?: string } | null> {
    const session = await getSession();

    if (!session.isLoggedIn || !session.uid || !session.password) {
        return null;
    }

    return {
        uid: session.uid,
        password: session.password,
        username: session.username,
    };
}
