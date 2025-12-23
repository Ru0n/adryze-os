import { NextRequest, NextResponse } from 'next/server';
import { getSessionCredentials } from '@/lib/auth';
import { createOdooClient } from '@/lib/odoo';

export async function GET(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const odoo = createOdooClient(credentials.uid, credentials.password);

        // Fetch leads from Odoo CRM
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status'); // new, qualified, won, etc.

        const domain: any[] = [];
        if (status) {
            // You can filter by stage name if needed
            domain.push(['stage_id.name', '=', status]);
        }

        const leads = await odoo.searchRead(
            'crm.lead',
            domain,
            ['id', 'name', 'phone', 'email', 'type', 'stage_id', 'user_id', 'description', 'create_date'],
            50
        );

        return NextResponse.json({ leads });
    } catch (error: any) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { name, phone, email, source, notes } = data;

        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Name and phone are required' },
                { status: 400 }
            );
        }

        const odoo = createOdooClient(credentials.uid, credentials.password);

        const leadData: any = {
            name,
            phone,
            type: 'lead',
            description: notes || '',
        };

        if (email) leadData.email = email;
        // Note: 'source' would need to be mapped to source_id in real implementation

        const leadId = await odoo.create('crm.lead', leadData);

        return NextResponse.json({ success: true, leadId });
    } catch (error: any) {
        console.error('Failed to create lead:', error);
        return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
    }
}
