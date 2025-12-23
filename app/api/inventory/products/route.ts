import { NextRequest, NextResponse } from 'next/server';
import { getSessionCredentials } from '@/lib/auth';
import { createOdooClient } from '@/lib/odoo';
import { OdooProduct } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const odoo = createOdooClient(credentials.uid, credentials.password);

        // Get search query from URL params
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');

        // Build domain filter
        const domain: any[] = [];
        if (search) {
            domain.push(['|', ['name', 'ilike', search], ['default_code', 'ilike', search]]);
        }

        const products = await odoo.searchRead<OdooProduct>(
            'product.template',
            domain,
            ['id', 'name', 'default_code', 'list_price', 'qty_available'],
            100 // Limit to 100 products
        );

        return NextResponse.json({ products });
    } catch (error: any) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { name, default_code, list_price, qty_available } = data;

        if (!name) {
            return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
        }

        const odoo = createOdooClient(credentials.uid, credentials.password);

        const productId = await odoo.create('product.template', {
            name,
            default_code: default_code || '',
            list_price: list_price || 0,
            type: 'product', // Storable product
        });

        // Update stock if qty_available is provided
        if (qty_available && qty_available > 0) {
            // Note: In a real implementation, you'd need to update stock.quant
            // For now, we'll just create the product
        }

        return NextResponse.json({ success: true, productId });
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { id, ...updates } = data;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const odoo = createOdooClient(credentials.uid, credentials.password);
        await odoo.write('product.template', [id], updates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to update product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const credentials = await getSessionCredentials();
        if (!credentials) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const odoo = createOdooClient(credentials.uid, credentials.password);

        // Soft delete (archive) instead of hard delete
        await odoo.write('product.template', [parseInt(id)], { active: false });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
