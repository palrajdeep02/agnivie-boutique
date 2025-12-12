"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { logInteraction } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // Added usePathname hook

    if (pathname.startsWith("/admin")) return null; // Added conditional return

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gold/20 bg-cream/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* Optional: Add Yellow Circle Logo SVG here if we had one, for now text is fine */}
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center mr-1">
                            <span className="font-serif text-black font-bold text-lg">A</span>
                        </div>
                        <span className="font-serif text-3xl font-bold tracking-tighter text-gold">
                            AGNIVIE
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium uppercase tracking-widest text-secondary hover:text-gold transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="tel:+918961806531" onClick={() => logInteraction('call')}>
                            <Button variant="outline" size="sm" className="hidden lg:flex">
                                Call Now
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-secondary"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gold/10 bg-cream"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-serif font-medium text-secondary"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <a href="tel:+918961806531" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        Call Now
                                    </Button>
                                </a>
                                <a href="https://wa.me/918961806531" target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button variant="whatsapp" className="w-full">
                                        WhatsApp Us
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
