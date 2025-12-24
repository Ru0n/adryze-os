-- Seed realistic demo data for Ncell Voice Intelligence Dashboard
INSERT INTO voice_logs (carrier, trunk_id, caller, call_status, duration, recording_url, ai_summary, timestamp)
VALUES 
('Ncell', 'ST_SIP_KTM_01', '+9779801234567', 'Completed', 145, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'Customer inquired about Ncell data pack validity; Agent provided info on the 30-day pack and confirmed balance.', NOW() - INTERVAL '10 minutes'),
('Ncell', 'ST_SIP_KTM_02', '+9779802345678', 'Missed', 0, NULL, 'No conversation recorded.', NOW() - INTERVAL '35 minutes'),
('Ncell', 'ST_SIP_KTM_01', '+9779813456789', 'Completed', 88, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'User reported issues with SMS delivery. AI Troubleshot terminal settings and confirmed service restoration.', NOW() - INTERVAL '1 hour'),
('Ncell', 'ST_SIP_KTM_03', '+9779804567890', 'Completed', 320, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'Corporate inquiry regarding bulk SMS rates for festive season. AI summarized pricing tiers and sent brochure link.', NOW() - INTERVAL '2 hours'),
('Ncell', 'ST_SIP_KTM_01', '+9779805678901', 'Rejected', 0, NULL, 'Call blocked by user preference.', NOW() - INTERVAL '3 hours'),
('Ncell', 'ST_SIP_KTM_02', '+9779816789012', 'Completed', 210, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'Balance inquiry and roaming activation request. AI verified identity and activated roaming plan for 7 days.', NOW() - INTERVAL '4 hours');
