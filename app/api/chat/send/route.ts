import { NextRequest, NextResponse } from 'next/server';
import { getSessionCredentials } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { channelId, conversationId, message, author_role = 'agent' } = await request.json();
        const finalConversationId = conversationId || channelId;

        if (!message || !finalConversationId) {
            return NextResponse.json({ error: 'Message and Conversation ID are required' }, { status: 400 });
        }

        // 1. Insert into Supabase
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    conversation_id: finalConversationId,
                    body: message,
                    author_role: author_role,
                    author_name: credentials.username || 'Agent'
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        // 2. Also send to n8n for real-world delivery if configured
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (webhookUrl && !webhookUrl.includes('placeholder')) {
            // Non-blocking fetch to n8n
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'send_message',
                    conversation_id: finalConversationId,
                    message,
                }),
            }).catch(err => console.error('n8n webhook failed:', err));
        }

        return NextResponse.json({ success: true, message: data[0] });
    } catch (error: any) {
        console.error('Failed to send message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
