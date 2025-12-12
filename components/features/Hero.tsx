"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative h-[80vh] w-full overflow-hidden bg-secondary">
            {/* Background Image Placeholder - In real app, use Next/Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop")' }}
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-gold text-lg md:text-xl font-sans tracking-[0.3em] uppercase">
                        Everyday fashion with an elegant touch 🌿
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-serif text-white font-medium leading-tight">
                        Threads of Tradition, <br /> Touch of Today
                    </h1>
                    <p className="max-w-xl mx-auto text-white/90 font-light text-lg tracking-wide">
                        Timeless Styles • Soft Fabrics • Affordable
                    </p>

                    <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center w-full px-4 md:px-0">
                        <Link href="/products" className="w-full md:w-auto">
                            <Button size="lg" className="w-full md:w-auto min-w-[160px] bg-gold text-black hover:bg-white hover:text-black border-none">
                                Shop Collection
                            </Button>
                        </Link>
                        <a href="https://wa.me/918961806531" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                            <Button variant="outline" size="lg" className="w-full md:w-auto min-w-[160px] text-white border-white hover:bg-white/10">
                                DM to Order 📩
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
