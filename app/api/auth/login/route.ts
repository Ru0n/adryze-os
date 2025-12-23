import { NextRequest, NextResponse } from 'next/server';
import { authenticateOdoo } from '@/lib/odoo';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Authenticate with Odoo
        const uid = await authenticateOdoo(username, password);

        if (!uid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        const session = await getSession();
        session.uid = uid;
        session.password = password; // Store API key securely in encrypted session
        session.username = username;
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({
            success: true,
            user: { uid, username }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Authentication failed. Please check your credentials.' },
            { status: 500 }
        );
    }
}
