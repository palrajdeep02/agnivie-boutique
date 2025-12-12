"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Category, fetchCategories } from "@/lib/db";
import { Loader2 } from "lucide-react";

export function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Fetch all and filter client side for MVP simplicity
                // In production with 100s of cats, use a specific firestore query.
                const allCats = await fetchCategories();
                const featuredCats = allCats.filter(c => c.featured).slice(0, 3);
                setCategories(featuredCats);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (loading) return null; // Or skeleton

    if (categories.length === 0) return null;

    return (
        <section className="py-20 bg-cream">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-4">Curated Categories</h2>
                    <div className="h-1 w-20 bg-gold mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, idx) => (
                        <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                            <motion.div
                                whileHover={{ y: -15, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-tr from-gold/40 to-transparent opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
                                <Card className="overflow-hidden group cursor-pointer border-none shadow-xl relative z-10">
                                    <CardContent className="p-0 relative aspect-[3/4]">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                            style={{ backgroundImage: `url('${cat.image || '/placeholder-category.jpg'}')` }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                                        {/* Golden Frame Border */}
                                        <div className="absolute inset-4 border border-white/30 group-hover:border-gold/80 transition-colors duration-500" />

                                        <div className="absolute bottom-0 left-0 w-full p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-2xl font-serif text-white tracking-widest drop-shadow-md group-hover:text-gold transition-colors">
                                                {cat.name}
                                            </h3>
                                            <div className="h-[1px] w-0 bg-gold mx-auto mt-2 transition-all duration-500 group-hover:w-12" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
