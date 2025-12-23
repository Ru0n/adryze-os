import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Get n8n webhook URL from env
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!webhookUrl || webhookUrl.includes('placeholder')) {
            return NextResponse.json({
                error: 'n8n webhook not configured',
                message: 'Visual search requires n8n integration. Please configure N8N_WEBHOOK_URL in your environment variables.'
            }, { status: 503 });
        }

        // Convert image to base64 for n8n
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64Image = buffer.toString('base64');

        // Send to n8n webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image,
                filename: image.name,
                type: 'visual_search',
            }),
        });

        if (!response.ok) {
            throw new Error('n8n webhook failed');
        }

        const result = await response.json();

        // Return standardized response
        return NextResponse.json({
            product_name: result.product_name || '',
            confidence: result.confidence || 'Low',
            sku: result.sku || '',
            suggested_products: result.suggested_products || [],
        });

    } catch (error: any) {
        console.error('Visual search error:', error);
        return NextResponse.json(
            { error: 'Visual search failed', details: error.message },
            { status: 500 }
        );
    }
}
