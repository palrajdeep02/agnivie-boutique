"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Product, fetchProducts } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export function NewArrivals() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNewArrivals = async () => {
            try {
                const { products: data } = await fetchProducts(undefined, undefined, 4, true);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load new arrivals", error);
            } finally {
                setLoading(false);
            }
        };
        loadNewArrivals();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto" />
                </div>
            </section>
        );
    }

    // Hide section if no products
    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-2">New Arrivals</h2>
                        <div className="h-1 w-20 bg-gold" />
                    </div>
                    <Link href="/products">
                        <Button variant="ghost" className="hidden md:flex text-gold hover:text-gold/80 hover:bg-transparent p-0">
                            View All Collection &rarr;
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 flex md:hidden justify-center">
                    <Link href="/products">
                        <Button variant="outline">View All Collection</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
