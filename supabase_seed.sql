-- Seed Data for Omnichannel Chat

-- 1. Insert Sample Conversations
INSERT INTO public.conversations (id, name, platform, avatar_url, last_message, unread_count, is_ai_paused, status, funnel_stage, priority)
VALUES 
('d5a2d8e4-78c9-4b1a-8e5f-1c4b9d0e2f3a', 'John Doe', 'whatsapp', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', 'Thanks for the info! I will check it out.', 0, false, 'automated', 'lead', 'low'),
('e6b3e9f5-89d0-4c2b-9f6f-2d5c0e1f3f4b', 'Sarah Smith', 'instagram', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'How much is the shipping to London?', 2, true, 'manual', 'qualified', 'high'),
('f7c4f0a6-90e1-4d3c-a07f-3e6d1f2a4b5c', 'Mike Jones', 'facebook', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', 'Is this item still available in blue?', 1, false, 'automated', 'proposal', 'medium'),
('a1b2c3d4-e5f6-4a5b-b6c7-d8e9f0a1b2c3', 'Alex Rivera', 'tiktok', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'Saw your video, really cool products!', 0, false, 'automated', 'negotiation', 'high')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Sample Messages
INSERT INTO public.messages (conversation_id, body, author_role, author_name)
VALUES 
-- WhatsApp Chat
('d5a2d8e4-78c9-4b1a-8e5f-1c4b9d0e2f3a', 'Hello, do you have the blue jacket in stock?', 'user', 'John Doe'),
('d5a2d8e4-78c9-4b1a-8e5f-1c4b9d0e2f3a', 'Let me check that for you right now!', 'ai', 'AI Agent'),
('d5a2d8e4-78c9-4b1a-8e5f-1c4b9d0e2f3a', 'Yes, we have 5 units left in blue.', 'ai', 'AI Agent'),
('d5a2d8e4-78c9-4b1a-8e5f-1c4b9d0e2f3a', 'Thanks for the info! I will check it out.', 'user', 'John Doe'),

-- Instagram Chat
('e6b3e9f5-89d0-4c2b-9f6f-2d5c0e1f3f4b', 'Hi! I love your page.', 'user', 'Sarah Smith'),
('e6b3e9f5-89d0-4c2b-9f6f-2d5c0e1f3f4b', 'How much is the shipping to London?', 'user', 'Sarah Smith'),

-- Facebook Chat
('f7c4f0a6-90e1-4d3c-a07f-3e6d1f2a4b5c', 'Hi, is this item still available in blue?', 'user', 'Mike Jones'),
('f7c4f0a6-90e1-4d3c-a07f-3e6d1f2a4b5c', 'Hello Mike! I am an AI assistant here to help. Yes, it is available!', 'ai', 'AI Agent'),

-- TikTok Chat
('a1b2c3d4-e5f6-4a5b-b6c7-d8e9f0a1b2c3', 'Saw your video, really cool products!', 'user', 'Alex Rivera')
ON CONFLICT DO NOTHING;
