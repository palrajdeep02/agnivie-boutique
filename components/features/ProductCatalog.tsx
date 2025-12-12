"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProducts, fetchCategories, Product, Category } from "@/lib/db";
import { ProductCard } from "@/components/features/ProductCard";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

function CatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialCategory = searchParams.get("cat") || "all";

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    // Fetch Categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await fetchCategories();
                setCategories(cats);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        loadCategories();
    }, []);

    // Sync active category with URL
    useEffect(() => {
        setActiveCategory(searchParams.get("cat") || "all");
    }, [searchParams]);

    // Fetch Products when Category changes
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setProducts([]); // Reset list on category change
            setLastDoc(undefined);
            try {
                const catId = activeCategory === "all" ? undefined : activeCategory;
                const { products: newProducts, lastVisible } = await fetchProducts(catId);

                setProducts(newProducts);
                setLastDoc(lastVisible);
                setHasMore(newProducts.length === 10); // Assuming pageSize is 10
            } catch (error) {
                console.error("Error loading products", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [activeCategory]);

    const loadMore = async () => {
        if (!lastDoc || loadingMore) return;
        setLoadingMore(true);
        try {
            const catId = activeCategory === "all" ? undefined : activeCategory;
            const { products: newProducts, lastVisible } = await fetchProducts(catId, lastDoc);

            setProducts((prev) => [...prev, ...newProducts]);
            setLastDoc(lastVisible);
            setHasMore(newProducts.length === 10);
        } catch (error) {
            console.error("Error loading more products", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleCategoryChange = (catSlug: string) => {
        if (catSlug === "all") {
            router.push("/products");
        } else {
            router.push(`/products?cat=${catSlug}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-4 text-secondary">Categories</h3>
                        <div className="flex flex-wrap md:flex-col gap-2">
                            <Button
                                variant={activeCategory === "all" ? "primary" : "ghost"}
                                onClick={() => handleCategoryChange("all")}
                                className="justify-start w-auto md:w-full"
                            >
                                All Products
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.id}
                                    variant={activeCategory === cat.slug ? "primary" : "ghost"}
                                    onClick={() => handleCategoryChange(cat.slug)}
                                    className="justify-start w-auto md:w-full"
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-3xl font-serif text-secondary capitalize">
                            {activeCategory === "all" ? "All Collection" : categories.find(c => c.slug === activeCategory)?.name || activeCategory}
                        </h1>
                        <p className="text-secondary/60 text-sm mt-1">
                            Showing {products.length} products
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-gray-200 rounded-none" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-dashed border-gray-200">
                            <p className="text-secondary/50">No products found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-12 text-center">
                                    <Button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        variant="outline"
                                        className="min-w-[200px]"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                                            </>
                                        ) : (
                                            "Load More"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ProductCatalog() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin text-gold" /></div>}>
            <CatalogContent />
        </Suspense>
    )
}
