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
        <div className="max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-secondary">Categories</h1>
                    <p className="text-secondary/60 mt-1 font-light">Organize your products into collections.</p>
                </div>
                <div className="text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                    <span className="font-medium text-secondary/60">Featured Limit: </span>
                    <span className={cn(featuredCount === 3 ? "text-green-600 font-bold" : "text-gold font-bold")}>
                        {featuredCount} / 3
                    </span>
                </div>
            </div>

            {/* Add/Edit Form */}
            <div className={cn("bg-white p-6 md:p-8 border shadow-sm rounded-xl transition-all duration-300", editingId ? "border-gold/40 shadow-gold/10" : "border-gray-100")}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-medium text-secondary/50 uppercase tracking-widest border-b border-gold/20 pb-1">
                        {editingId ? "Edit Collection" : "New Collection"}
                    </h2>
                    {editingId && (
                        <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-xs h-7 text-red-400 hover:text-red-500 hover:bg-red-50">
                            Cancel Editing
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Image Upload Box */}
                        <div
                            className={cn(
                                "w-full md:w-32 h-32 flex-shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-colors",
                                newCatImage ? "border-gold/50 bg-white" : "border-gray-200 hover:border-gold/50 bg-gray-50 hover:bg-gold/5"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {newCatImage ? (
                                <div className="relative w-full h-full group">
                                    <img src={newCatImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Pencil className="text-white h-5 w-5" />
                                    </div>
                                </div>
                            ) : (
                                submitting && !newCatImage && isFeatured ? <Loader2 className="animate-spin text-gold" /> :
                                    <div className="text-center p-2">
                                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                        <span className="text-[10px] text-gray-400 uppercase font-medium">Upload</span>
                                    </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="flex-1 w-full space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm text-secondary font-medium">Category Name</label>
                                <Input
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                    placeholder="e.g. Royal Silk Sarees"
                                    required
                                    className="border-gray-200 focus:border-gold focus:ring-gold/20"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer w-fit p-3 bg-gray-50 rounded-lg hover:bg-gold/5 transition-colors border border-transparent hover:border-gold/20">
                                <div className={cn(
                                    "w-5 h-5 border rounded flex items-center justify-center transition-colors shadow-sm",
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
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-secondary">Feature on Homepage</span>
                                    <span className="text-xs text-secondary/60">Show in the "Curated Collections" section</span>
                                </div>
                            </label>
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full md:w-auto self-end h-12 bg-secondary hover:bg-black text-white px-8 shadow-lg shadow-gold/10">
                            {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : (editingId ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />)}
                            {editingId ? "Update Category" : "Create Category"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {categories.map((cat) => (
                    <div key={cat.id} className={cn("bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4", editingId === cat.id ? "border-gold ring-1 ring-gold" : "border-gray-100")}>
                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] uppercase">No Img</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-medium text-secondary truncate">{cat.name}</h3>
                            <button
                                onClick={() => toggleFeatured(cat)}
                                className="flex items-center gap-1 mt-1 text-xs text-gray-500 hover:text-gold"
                            >
                                <Star className={cn("h-3 w-3", cat.featured ? "text-gold fill-gold" : "text-gray-300")} />
                                {cat.featured ? "Featured" : "Regular"}
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 border-l pl-3 border-gray-100">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-400 hover:bg-blue-50"
                                onClick={() => handleEdit(cat)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:bg-red-50"
                                onClick={() => cat.id && handleDelete(cat.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Elegant Table */}
            <div className="hidden md:block bg-white border border-gold/10 shadow-sm overflow-hidden rounded-xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary text-white border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80">COLLECTION</th>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80 text-center">FEATURED</th>
                            <th className="px-6 py-5 font-sans font-light tracking-wider text-sm opacity-80 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400">No categories found. Create your first collection above.</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id} className={cn("group hover:bg-gold/5 transition-colors", editingId === cat.id ? "bg-gold/10" : "")}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-gray-100 rounded-md overflow-hidden shadow-sm border border-gray-200">
                                                {cat.image ? (
                                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif text-xs">No Img</div>
                                                )}
                                            </div>
                                            <span className="font-serif font-medium text-secondary text-lg">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleFeatured(cat)}
                                            className="p-2 hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-gray-100"
                                            title="Toggle Featured Status"
                                        >
                                            <Star className={cn(
                                                "h-5 w-5 transition-transform active:scale-95",
                                                cat.featured ? "text-gold fill-gold" : "text-gray-200 hover:text-gray-300"
                                            )} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2 hover:bg-secondary hover:text-white"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                <Pencil className="h-4 w-4" /> Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => cat.id && handleDelete(cat.id)}
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
