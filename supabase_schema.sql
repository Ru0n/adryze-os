-- 1. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'whatsapp', 'instagram', 'facebook', 'tiktok'
    avatar_url TEXT,
    last_message TEXT,
    unread_count INT DEFAULT 0,
    is_ai_paused BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'automated', -- 'automated', 'manual'
    funnel_stage TEXT DEFAULT 'lead', -- 'lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    author_role TEXT NOT NULL, -- 'user', 'agent', 'ai'
    author_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 4. Set up row level security (RLS) - Basic public access for now
-- Note: In production, you'd restrict this to authenticated users
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.conversations FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.messages FOR INSERT WITH CHECK (true);
