import { NextRequest, NextResponse } from 'next/server';
import { getSessionCredentials } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const platform = searchParams.get('platform');

        let query = supabase
            .from('conversations')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(50);

        if (platform && platform !== 'all') {
            query = query.eq('platform', platform);
        }

        const { data: channels, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({ channels });
    } catch (error: any) {
        console.error('Failed to fetch conversations:', error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}
