"use client";

import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Category, fetchCategories } from "@/lib/db";

export function Footer() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadCats = async () => {
            try {
                const cats = await fetchCategories();
                // Take top 4 for footer
                setCategories(cats.slice(0, 4));
            } catch (err) {
                console.error("Failed to load footer categories", err);
            }
        };
        loadCats();
    }, []);

    return (
        <footer className="bg-secondary text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <h3 className="font-serif text-3xl font-bold text-gold">AGNIVIE</h3>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Everyday fashion with an elegant touch.
                            Threads of Tradition, Touch of Today.
                        </p>
                    </div>

                    {/* Explore Paths (Dynamic) */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-gold">Explore</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-sm text-white/60 hover:text-gold transition-colors">
                                    All Products
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/products?cat=${cat.slug}`}
                                        className="text-sm text-white/60 hover:text-gold transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/contact" className="text-sm text-white/60 hover:text-gold transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-gold">Visit Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <MapPin className="h-5 w-5 text-gold shrink-0" />
                                <span>Online Store <br />(Based in India)</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <Phone className="h-4 w-4 text-gold shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/60">
                                <Mail className="h-4 w-4 text-gold shrink-0" />
                                <span>hello@agnivie.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-gold">Opening Hours</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li className="flex justify-between">
                                <span>Mon - Sat</span>
                                <span>10:00 AM - 10:00 PM</span>
                            </li>
                            <li className="flex justify-between text-gold/80">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} Agnivie. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://instagram.com/agnivie.india" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all text-white/60">
                            <Instagram className="h-4 w-4" />
                        </a>
                        <Link href="#" className="p-2 rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all text-white/60">
                            <Facebook className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
