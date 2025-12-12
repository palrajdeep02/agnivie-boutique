import { Metadata } from "next";
import { ProductCatalog } from "@/components/features/ProductCatalog";

export const metadata: Metadata = {
    title: "Collection | Aurum Boutique",
    description: "Browse our exclusive collection of Sarees, Kurtis and Bridal wear.",
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-cream">
            <div className="bg-secondary text-white py-12 mb-8">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide">Our Collection</h1>
                    <div className="h-1 w-16 bg-gold mx-auto mt-4" />
                </div>
            </div>
            <ProductCatalog />
        </main>
    );
}
