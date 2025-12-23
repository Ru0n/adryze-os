'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Loader2 } from 'lucide-react';

interface VisualSearchProps {
    onSearchResult: (keyword: string) => void;
}

export default function VisualSearch({ onSearchResult }: VisualSearchProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        setResult(null);

        try {
            // Compress image before uploading
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            // Upload to API
            const formData = new FormData();
            formData.append('image', compressedFile);

            const response = await fetch('/api/inventory/visual-search', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 503) {
                    setError('Visual search is not configured. Please set up n8n webhook.');
                } else {
                    setError(data.error || 'Search failed');
                }
                return;
            }

            setResult(data);

            // Auto-filter the inventory table with the product name
            if (data.product_name) {
                onSearchResult(data.product_name);
            }

        } catch (err: any) {
            setError('Failed to upload image. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900/50"
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center gap-3">
                    {uploading ? (
                        <>
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Analyzing image...
                            </p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-zinc-400" />
                            <div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Drop an image here or click to upload
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    AI will identify the bike part
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Result Display */}
            {result && (
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-300">
                                Product Identified: {result.product_name}
                            </p>
                            <div className="mt-1 text-xs text-green-700 dark:text-green-400">
                                <span>Confidence: {result.confidence}</span>
                                {result.sku && <span className="ml-3">SKU: {result.sku}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
