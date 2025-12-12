"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product, Category, fetchCategories, addProduct, updateProduct, uploadImage } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, X, Upload } from "lucide-react";

interface AdminProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export function AdminProductForm({ initialData, isEdit = false }: AdminProductFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [name, setName] = useState(initialData?.name || "");
    const [code, setCode] = useState(initialData?.code || "");
    const [price, setPrice] = useState(initialData?.price?.toString() || "");
    const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [featured, setFeatured] = useState(initialData?.featured || false);
    const [status, setStatus] = useState(initialData?.status ?? true);
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    // Upload State
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const loadCats = async () => {
            const cats = await fetchCategories();
            setCategories(cats);
        };
        loadCats();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        console.log("Starting upload for files:", e.target.files.length);

        try {
            const files = Array.from(e.target.files);
            const uploadPromises = files.map(async (file) => {
                const path = `products/${Date.now()}-${file.name}`;
                console.log(`Uploading ${file.name} to ${path}...`);
                try {
                    const url = await uploadImage(file, path);
                    console.log(`Success: ${file.name} -> ${url}`);
                    return url;
                } catch (innerErr) {
                    console.error(`Failed to upload ${file.name}`, innerErr);
                    throw innerErr;
                }
            });

            const urls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...urls]);
        } catch (error: any) {
            alert("Upload failed: " + error.message);
            console.error("Upload Error Full:", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name,
                code,
                price: Number(price),
                category_id: categoryId,
                description,
                featured,
                status,
                images
            };

            if (isEdit && initialData?.id) {
                await updateProduct(initialData.id, productData);
            } else {
                await addProduct(productData);
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-medium text-secondary border-b pb-2">Basic Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Product Name</label>
                        <Input
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Royal Banarasi Silk"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Product Code</label>
                        <Input
                            required
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="Ex: SR-001"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Price (₹)</label>
                        <Input
                            required
                            type="number"
                            min="0"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="15000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Category</label>
                        <select
                            className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary">Description</label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-none border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Product details, material, care instructions..."
                        required
                    />
                </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-medium text-secondary border-b pb-2">Images</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-[3/4] group border border-gray-200 bg-gray-50">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}

                    <div
                        className="aspect-[3/4] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gold" />
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 font-medium">Add Images</span>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-serif font-medium text-secondary border-b pb-2">Settings</h2>
                <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={e => setFeatured(e.target.checked)}
                            className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-secondary">Mark as Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={status}
                            onChange={e => setStatus(e.target.checked)}
                            className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-secondary">Active Status</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading || uploading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEdit ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
