import { Metadata } from "next";
import { getProduct, Product } from "@/lib/db";
import { ProductDetail } from "@/components/features/ProductDetail";
import { notFound } from "next/navigation";

// Define Page Props type for Next.js 15+ (Next 15 params are async)
// But since we are likely on Next 14 based on prompts, we use standard params.
// However, the user installed `next: 16.0.10`? Wait, checking package.json...
// Ah, the user has `next: 16.0.10` in package.json from the `list_dir` output earlier?
// Wait, `package.json` showed `"next": "16.0.10"`.  Next.js 15+ changed params to be a Promise.
// Let's check `package.json` again or handle both cases or just assume Promise for v15+.
// Actually, `create-next-app@latest` usually installs the latest canary or stable. v15 is current stable.
// Let's handle `params` as a Promise to be safe for Next.js 15.

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: `${product.name} | Aurum Boutique`,
        description: product.description.substring(0, 160),
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-cream">
            <ProductDetail product={product as Product} />
        </main>
    );
}
