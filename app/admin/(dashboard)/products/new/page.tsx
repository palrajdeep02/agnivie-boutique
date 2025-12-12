import { AdminProductForm } from "@/components/features/AdminProductForm";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-medium text-secondary">Add New Product</h1>
            <AdminProductForm />
        </div>
    );
}
