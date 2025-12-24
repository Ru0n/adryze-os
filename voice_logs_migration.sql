-- Create voice_logs table for Ncell Voice Intelligence Dashboard
CREATE TABLE IF NOT EXISTS voice_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier TEXT NOT NULL DEFAULT 'Ncell',
    trunk_id TEXT NOT NULL,
    caller TEXT NOT NULL,
    call_status TEXT NOT NULL, -- Completed, Missed, Rejected
    duration INTEGER NOT NULL, -- in seconds
    recording_url TEXT,
    ai_summary TEXT,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for this table
ALTER TABLE voice_logs REPLICA IDENTITY FULL;
