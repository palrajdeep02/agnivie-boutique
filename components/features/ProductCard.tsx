"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Product, logInteraction } from "@/lib/db";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    // Format price to INR
    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(product.price);

    const whatsappMessage = `Hi, I want to order Product Code: ${product.code}`;
    const whatsappLink = `https://wa.me/918961806531?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Card className="group relative border-none shadow-none bg-white overflow-hidden">
            {/* Gold Border Reveal */}
            <div className="absolute inset-0 border-2 border-gold/0 transition-all duration-500 z-20 pointer-events-none group-hover:border-gold/50 group-hover:inset-2" />

            <div className="p-0 overflow-hidden relative aspect-[3/4]">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                    <CardContent className="p-0 w-full h-full">
                        {/* Image Zoom */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                            style={{ backgroundImage: `url('${product.images[0]}')` }}
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {product.featured && (
                            <div className="absolute top-4 left-4 z-10 bg-gold text-secondary text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-md">
                                Featured
                            </div>
                        )}
                    </CardContent>
                </Link>

                {/* Quick Actions Overlay (Slide Up) - Structurally outside Link to prevent hydration error */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-20 flex flex-col gap-2 pointer-events-none group-hover:pointer-events-auto">
                    <div className="grid grid-cols-2 gap-2">
                        <a href="tel:+918961806531" className="w-full" onClick={() => logInteraction('call')}>
                            <Button variant="primary" size="sm" className="w-full text-xs font-serif bg-white/90 text-black hover:bg-gold hover:text-white border-none backdrop-blur-md">
                                <Phone className="h-3 w-3 mr-1" /> Call
                            </Button>
                        </a>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full" onClick={() => logInteraction('whatsapp')}>
                            <Button variant="whatsapp" size="sm" className="w-full text-xs font-serif shadow-lg">
                                <MessageCircle className="h-3 w-3 mr-1" /> Order
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            <CardFooter className="flex flex-col items-center p-5 text-center bg-white relative z-10 transition-colors duration-300 group-hover:bg-cream">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-serif text-lg font-medium text-secondary mb-1 hover:text-gold transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-[10px] text-secondary/40 font-sans tracking-[0.2em] uppercase mb-2">
                    {product.code}
                </p>
                <div className="flex items-center gap-2">
                    <span className="font-serif text-lg text-primary font-medium">
                        {formattedPrice}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
