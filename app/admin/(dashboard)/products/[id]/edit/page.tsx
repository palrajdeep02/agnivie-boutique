"use client";

import { useEffect, useState, use } from "react"; // 'use' for unwrapping params in Next 15/client
import { AdminProductForm } from "@/components/features/AdminProductForm";
import { getProduct, Product } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

// Since this is a client component usage with dynamic routes, we need to handle params carefully.
// However, page.tsx can be Server Component which fetches data then renders Client Form.
// Let's make this page a CLIENT component for simplicity in data fetching hook, 
// OR better: Server Component page that fetches data -> Client Component Form.

// Let's refactor to Server Component Pattern
// Wait, 'getProduct' is safe? Yes, it uses 'db' which is initialized in 'firebase.ts'.
// Firebase Client SDK can be used in Server Components in Next.js App Router 
// BUT 'firebase/firestore' is the Client SDK. It might complain about "window not defined" if initialized poorly.
// Our 'firebase.ts' checks 'getApps()' so it might be safe. 
// BUT Standard practice with Firebase Client SDK is to use it in Client Components.
// We'll stick to Client Component for this Edit Page to avoid SSR issues with Firebase Client SDK.

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React 19 'use' or just await if async component.
    // Since we are markng file "use client", we can't make the component async in the same way.
    // We should use an effect to unwrap params or just use the hook if available.
    // Actually, easiest way for "use client" page is to use `React.use(params)` if on Next 15.
    // Or just standard useEffect.

    const [id, setId] = useState<string>("");
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hack to unwrap params
        params.then((resolvedParams) => {
            setId(resolvedParams.id);

            // Fetch
            getProduct(resolvedParams.id).then((p) => {
                setProduct(p as Product);
                setLoading(false);
            });
        });
    }, [params]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!product) {
        return <div className="p-8">Product not found</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-medium text-secondary">Edit Product</h1>
            <AdminProductForm initialData={product} isEdit={true} />
        </div>
    );
}
