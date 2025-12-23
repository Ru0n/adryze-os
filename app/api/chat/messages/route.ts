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
        const conversationId = searchParams.get('channelId') || searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
        }

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(100);

        if (error) {
            throw error;
        }

        return NextResponse.json({ messages });
    } catch (error: any) {
        console.error('Failed to fetch messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
