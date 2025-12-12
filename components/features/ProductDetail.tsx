"use client";

import React from "react";
import { Product, logInteraction } from "@/lib/db";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/Button";
import { Phone, MessageCircle, Share2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ProductDetailProps {
    product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
    const whatsappMessage = `Hi, I want to order Product Code: ${product.code}`;
    const whatsappLink = `https://wa.me/918961806531?text=${encodeURIComponent(whatsappMessage)}`;

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Left: Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProductGallery images={product.images} />
                </motion.div>

                {/* Right: Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col space-y-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-wider text-gold uppercase border border-gold px-2 py-1">
                                {product.code}
                            </span>
                            {product.featured && (
                                <span className="text-xs font-semibold tracking-wider bg-secondary text-white px-2 py-1 uppercase">
                                    Featured
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif text-secondary leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-2xl font-sans text-secondary/80 font-medium">
                            {formattedPrice}
                        </p>
                    </div>

                    <div className="border-t border-b border-gray-100 py-6 space-y-4">
                        <h3 className="font-serif text-lg text-secondary">Description</h3>
                        <p className="text-secondary/70 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                            onClick={() => logInteraction('whatsapp')}
                        >
                            <Button variant="whatsapp" size="lg" className="w-full gap-2 text-lg h-14">
                                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
                            </Button>
                        </a>
                        <a
                            href="tel:+918961806531"
                            className="block w-full"
                            onClick={() => logInteraction('call')}
                        >
                            <Button variant="outline" size="lg" className="w-full gap-2 text-lg h-14 border-secondary text-secondary hover:bg-secondary hover:text-white">
                                <Phone className="h-5 w-5" /> Call for Enquiry
                            </Button>
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-secondary/60 pt-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-gold" />
                            <span>Authentic Quality Guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-gold" />
                            <span>Share this Product</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
