"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Loader2, Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Category, fetchCategories, addCategory, updateCategoryStatus, updateCategory, uploadImage } from "@/lib/db";
import { deleteDoc as firestoreDelete, doc as firestoreDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCatName, setNewCatName] = useState("");
    const [newCatImage, setNewCatImage] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadCats = async () => {
        try {
            const cats = await fetchCategories();
            setCategories(cats);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCats();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setSubmitting(true);
        try {
            const file = e.target.files[0];
            const url = await uploadImage(file, `categories/${Date.now()}-${file.name}`);
            setNewCatImage(url);
        } catch (error) {
            alert("Image upload failed");
        } finally {
            setSubmitting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        if (isFeatured && !newCatImage) {
            alert("Featured categories must have an image.");
            return;
        }

        // Limit Check for Featured (Skip check if we are editing an already featured item)
        if (isFeatured) {
            const currentFeatured = categories.filter(c => c.featured && c.id !== editingId).length;
            if (currentFeatured >= 3) {
                if (!confirm(`You already have ${currentFeatured} featured categories. This will add a 4th one. Continue?`)) {
                    return;
                }
            }
        }

        setSubmitting(true);
        try {
            const slug = newCatName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

            if (editingId) {
                // Update existing
                await updateCategory(editingId, {
                    name: newCatName,
                    slug, // Update slug if name changes? Yes.
                    image: newCatImage,
                    featured: isFeatured
                });
            } else {
                // Add new
                await addCategory(newCatName, slug, newCatImage, isFeatured);
            }

            // Reset form
            setEditingId(null);
            setNewCatName("");
            setNewCatImage("");
            setIsFeatured(false);

            await loadCats();
        } catch (e) {
            alert("Failed to save category");
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id || null);
        setNewCatName(cat.name);
        setNewCatImage(cat.image || "");
        setIsFeatured(cat.featured || false);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            await firestoreDelete(firestoreDoc(db, "categories", id));
            setCategories(categories.filter(c => c.id !== id));
            if (editingId === id) {
                setEditingId(null);
                setNewCatName("");
                setNewCatImage("");
                setIsFeatured(false);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        }
    };

    const toggleFeatured = async (cat: Category) => {
        if (!cat.id) return;

        // If turning ON, check limit
        if (!cat.featured) {
            const currentFeatured = categories.filter(c => c.featured).length;
            if (currentFeatured >= 3) {
                alert("You should only have 3 featured categories for the best layout.");
            }
        }

        const newStatus = !cat.featured;
        try {
            // Optimistic update
            const updated = categories.map(c => c.id === cat.id ? { ...c, featured: newStatus } : c);
            setCategories(updated);

            await updateCategoryStatus(cat.id, newStatus);
        } catch (e) {
            console.error(e);
            loadCats();
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewCatName("");
        setNewCatImage("");
        setIsFeatured(false);
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin text-gold" /></div>;

    const featuredCount = categories.filter(c => c.featured).length;

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-serif font-medium text-secondary">Manage Categories</h1>
                <div className="text-sm">
                    <span className="font-medium text-secondary">Featured: </span>
                    <span className={cn(featuredCount === 3 ? "text-green-600" : "text-gold")}>
                        {featuredCount} / 3
                    </span>
                </div>
            </div>

            {/* Add/Edit Form */}
            <div className={cn("bg-white p-6 border shadow-sm rounded-lg transition-colors", editingId ? "border-gold/30 shadow-md" : "border-gray-100")}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-medium text-secondary uppercase tracking-wider">
                        {editingId ? "Edit Category" : "Add New Category"}
                    </h2>
                    {editingId && (
                        <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-xs h-7">
                            Cancel
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4 items-start">
                        {/* Image Upload Box */}
                        <div
                            className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-200 hover:border-gold rounded-md flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-gray-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {newCatImage ? (
                                <img src={newCatImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                submitting && !newCatImage && isFeatured ? <Loader2 className="animate-spin text-gold" /> :
                                    <Upload className="h-6 w-6 text-gray-400" />
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <Input
                                value={newCatName}
                                onChange={e => setNewCatName(e.target.value)}
                                placeholder="Category Name (e.g. Silk Sarees)"
                                required
                            />

                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                <div className={cn(
                                    "w-5 h-5 border rounded flex items-center justify-center transition-colors",
                                    isFeatured ? "bg-gold border-gold" : "border-gray-300 bg-white"
                                )}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isFeatured}
                                        onChange={e => setIsFeatured(e.target.checked)}
                                    />
                                    {isFeatured && <Star className="h-3 w-3 text-white fill-current" />}
                                </div>
                                <span className="text-sm text-secondary">Feature on Homepage (Curated)</span>
                            </label>
                        </div>

                        <Button type="submit" disabled={submitting} className="h-auto py-3 min-w-[140px]">
                            {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : (editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
                            <span className="ml-2 hidden md:inline">{editingId ? "Update" : "Add"} Category</span>
                        </Button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-secondary/70 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium">Image</th>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium text-center">Featured</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No categories found.</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id} className={cn("hover:bg-gray-50/50 transition-colors", editingId === cat.id ? "bg-gold/5" : "")}>
                                    <td className="px-6 py-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif text-xs">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-medium text-secondary">{cat.name}</td>
                                    <td className="px-6 py-3 text-center">
                                        <button
                                            onClick={() => toggleFeatured(cat)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            title="Toggle Featured"
                                        >
                                            <Star className={cn(
                                                "h-5 w-5 transition-colors",
                                                cat.featured ? "text-gold fill-gold" : "text-gray-300"
                                            )} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-gold hover:bg-gold/5"
                                                onClick={() => handleEdit(cat)}
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => cat.id && handleDelete(cat.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
