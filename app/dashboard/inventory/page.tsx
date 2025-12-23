'use client';

import { useState } from 'react';
import useSWR from 'swr';
import VisualSearch from '@/components/inventory/VisualSearch';
import { Package, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { OdooProduct } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<OdooProduct>>({});

    // Fetch products with SWR
    const { data, error, mutate } = useSWR(
        searchQuery
            ? `/api/inventory/products?search=${encodeURIComponent(searchQuery)}`
            : '/api/inventory/products',
        fetcher,
        { refreshInterval: 0 } // Only refresh on demand for inventory
    );

    const products: OdooProduct[] = data?.products || [];
    const isLoading = !data && !error;

    const handleVisualSearchResult = (keyword: string) => {
        setSearchQuery(keyword);
    };

    const handleEdit = (product: OdooProduct) => {
        setEditingId(product.id);
        setEditValues({
            list_price: product.list_price,
            qty_available: product.qty_available,
        });
    };

    const handleSave = async (productId: number) => {
        try {
            await fetch('/api/inventory/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId, ...editValues }),
            });

            setEditingId(null);
            mutate(); // Refresh data
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const handleDelete = async (productId: number) => {
        if (!confirm('Are you sure you want to archive this product?')) return;

        try {
            await fetch(`/api/inventory/products?id=${productId}`, {
                method: 'DELETE',
            });

            mutate(); // Refresh data
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                            <Package className="w-8 h-8" />
                            Inventory Management
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            Visual search • Real-time sync with Odoo
                        </p>
                    </div>
                </div>

                {/* Visual Search */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                        🔍 AI Visual Search
                    </h2>
                    <VisualSearch onSearchResult={handleVisualSearchResult} />
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or SKU..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                            Loading products...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                            No products found
                                        </td>
                                    </tr>
                                )}

                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            {product.default_code || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {editingId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editValues.list_price || 0}
                                                    onChange={(e) => setEditValues({ ...editValues, list_price: parseFloat(e.target.value) })}
                                                    className="w-24 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                                />
                                            ) : (
                                                <span className="text-zinc-900 dark:text-white">
                                                    ${product.list_price.toFixed(2)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {editingId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editValues.qty_available || 0}
                                                    onChange={(e) => setEditValues({ ...editValues, qty_available: parseFloat(e.target.value) })}
                                                    className="w-20 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                                />
                                            ) : (
                                                <span className="text-zinc-900 dark:text-white">
                                                    {product.qty_available}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {editingId === product.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSave(product.id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="px-3 py-1 bg-zinc-500 text-white rounded hover:bg-zinc-600 transition-colors text-xs font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
