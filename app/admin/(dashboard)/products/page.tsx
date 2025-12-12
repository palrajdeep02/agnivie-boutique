"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchProducts, deleteProduct, Product } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadProducts = async () => {
        try {
            // Fetch for admin: isPublic = false (show all statuses)
            const { products: data } = await fetchProducts(undefined, undefined, 50, false);
            setProducts(data);
        } catch (error: any) {
            console.error("Failed to load products", error);
            alert("Failed to load products: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id: string, images: string[]) => {
        if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            try {
                await deleteProduct(id, images);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-medium text-secondary">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-secondary/70 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Image</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Code</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No products found. Click "Add Product" to create one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="h-12 w-12 bg-gray-100 rounded-sm overflow-hidden">
                                                {product.images[0] && (
                                                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-medium text-secondary">{product.name}</td>
                                        <td className="px-6 py-3 text-secondary/70">{product.code}</td>
                                        <td className="px-6 py-3 text-secondary/70">₹{product.price.toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-3 text-secondary/70 capitalize">{product.category_id}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/products/${product.id}`} target="_blank">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-secondary">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-600 hover:bg-blue-50">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => product.id && handleDelete(product.id, product.images)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
