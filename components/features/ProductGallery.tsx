"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border border-gray-100">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedImage}
                        src={images[selectedImage]}
                        alt="Product"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={cn(
                                "relative w-20 aspect-[3/4] flex-shrink-0 overflow-hidden border-2 transition-all",
                                selectedImage === idx ? "border-gold opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
