import { db } from "./firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    Timestamp,
    DocumentData,
    QueryDocumentSnapshot
} from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Removed for Cloudinary

// Types
export interface Product {
    id?: string;
    name: string;
    code: string;
    category_id: string; // ID of the category document
    description: string;
    price: number;
    images: string[];
    featured: boolean;
    status: boolean; // Active/Inactive
    created_at?: number; // Milliseconds
}

export interface Category {
    id?: string;
    name: string;
    slug: string;
    image?: string;
    featured?: boolean;
    created_at?: number; // Milliseconds
}

// --- generic fetch helper ---
const convertDoc = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
    const data = doc.data();

    // Safely convert Timestamp to number if present
    if (data.created_at && data.created_at instanceof Timestamp) {
        data.created_at = data.created_at.toMillis();
    }

    return { id: doc.id, ...data } as T;
};


// --- PRODUCTS ---

export const fetchProducts = async (
    categoryId?: string,
    lastProduct?: QueryDocumentSnapshot<DocumentData>,
    pageSize: number = 10,
    isPublic: boolean = true
) => {
    try {
        const productsRef = collection(db, "products");

        // Base query
        // Note: If filtering by category, we might need composite index if we sort by created_at.
        // For Admin (isPublic=false), we want generic list ideally sorted by created_at.
        // Base query - Removed orderBy temporarily to ensure all products load even if missing created_at
        let q = query(productsRef, limit(pageSize));

        if (categoryId && categoryId !== "all") {
            q = query(q, where("category_id", "==", categoryId));
        }

        if (isPublic) {
            q = query(q, where("status", "==", true));
        }


        if (lastProduct) {
            q = query(q, startAfter(lastProduct));
        }

        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => convertDoc<Product>(doc));
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        return { products, lastVisible };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProduct = async (id: string) => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return convertDoc<Product>(docSnap);
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
};

export const addProduct = async (product: Omit<Product, "id" | "created_at">) => {
    try {
        const productsRef = collection(db, "products");
        const docRef = await addDoc(productsRef, {
            ...product,
            created_at: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: string, imageUrls: string[]) => {
    try {
        // 1. Delete images from storage first
        // 1. Delete images from storage first
        // Note: For Cloudinary client-side deletion, we need a signed request or backend API.
        // For MVP, we will skip deleting from Cloudinary to avoid backend complexity. 
        // Images will remain in cloud but link removed from DB.
        /* 
        if (imageUrls && imageUrls.length > 0) {
             // ...Cloudinary delete implementation would go here...
        }
        */

        // 2. Delete doc
        const docRef = doc(db, "products", id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};


// --- CATEGORIES ---

export const fetchCategories = async () => {
    try {
        const catRef = collection(db, "categories");
        const q = query(catRef, orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => convertDoc<Category>(doc));
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export interface Category {
    id?: string;
    name: string;
    slug: string;
    image?: string;
    featured?: boolean;
    created_at?: number; // Milliseconds
}

// ... (fetchCategories remains same)

export const addCategory = async (name: string, slug: string, image: string = "", featured: boolean = false) => {
    try {
        const catRef = collection(db, "categories");
        await addDoc(catRef, {
            name,
            slug,
            image,
            featured,
            created_at: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
}

// Helper to toggle featured status (for quick admin updates)
export const updateCategoryStatus = async (id: string, featured: boolean) => {
    try {
        const docRef = doc(db, "categories", id);
        await updateDoc(docRef, { featured });
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}


// Helper to update a category
export const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
        const docRef = doc(db, "categories", id);
        // If name changes, we might want to update slug too, but keeping it simple for now.
        // Or user passes slug in updates if they want.
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

// --- STORAGE UTILS (CLOUDINARY) ---

export const uploadImage = async (file: File, path: string) => {
    // path arg is kept for compatibility but Cloudinary generates its own public_id usually 
    // or we can use it as 'public_id' param if we really want to control it.
    // For simplicity with unsigned uploads, we often let Cloudinary decide or just pass basic params.

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary keys missing in .env.local");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    // folder: "products" can be set here if the preset allows it
    formData.append("folder", "products");

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || "Upload failed");
        }

        const data = await res.json();
        return data.secure_url; // Return the HTTPS URL
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};
