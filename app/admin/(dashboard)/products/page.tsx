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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-secondary">Products</h1>
                    <p className="text-secondary/60 font-light mt-1">Manage your boutique collection.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-secondary hover:bg-black text-white gap-2 w-full md:w-auto shadow-lg shadow-gold/10">
                        <Plus className="h-4 w-4" /> Add New Item
                    </Button>
                </Link>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-xl border border-gold/20 shadow-sm flex flex-col gap-4">
                        <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden relative">
                            {product.images[0] ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}
                            {product.featured && (
                                <span className="absolute top-2 right-2 bg-gold text-black text-[10px] px-2 py-1 font-bold uppercase tracking-wider">
                                    Featured
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-serif font-medium text-lg text-secondary line-clamp-1">{product.name}</h3>
                            <p className="text-gold font-medium">₹{product.price.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{product.category_id}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-gray-100">
                            <Link href={`/products/${product.id}`} className="flex justify-center">
                                <Button variant="ghost" size="sm" className="h-8 w-full"><Eye className="h-4 w-4 text-gray-400" /></Button>
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`} className="flex justify-center">
                                <Button variant="ghost" size="sm" className="h-8 w-full"><Pencil className="h-4 w-4 text-blue-500" /></Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="h-8 w-full" onClick={() => product.id && handleDelete(product.id, product.images)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Elegant Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gold/10 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-secondary text-white border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80">PRODUCT</th>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80">CODE</th>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80">PRICE</th>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80">CATEGORY</th>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-gray-400 font-light">
                                    No products found in your catalog.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="group hover:bg-gold/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden shadow-sm border border-gray-200">
                                                {product.images[0] && (
                                                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-serif font-medium text-secondary text-lg">{product.name}</p>
                                                {product.featured && <span className="text-[10px] bg-gold/20 text-secondary px-2 py-0.5 rounded-full font-bold">FEATURED</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary/60 font-mono text-sm">{product.code}</td>
                                    <td className="px-6 py-4 text-secondary font-medium">₹{product.price.toLocaleString("en-IN")}</td>
                                    <td className="px-6 py-4 text-secondary/60 capitalize">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium tracking-wide">{product.category_id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/products/${product.id}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-secondary hover:text-white transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-500 hover:text-white transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 hover:bg-red-500 hover:text-white transition-colors"
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
    );
}
