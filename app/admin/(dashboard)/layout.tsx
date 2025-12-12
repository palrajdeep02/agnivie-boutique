"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/features/AuthProvider"; // We haven't exported this properly from AuthProvider file yet? Wait, yes we did.
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Layers, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Need to ensure AuthProvider is wrapping the app or at least this section. 
// Ideally AuthProvider should wrap the entire app in RootLayout, but I didn't add it there yet.
// I should add AuthProvider to RootLayout or just this layout. 
// Adding to RootLayout is safer for global state. 

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/admin/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!user) return null; // Prevent flash of content

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Categories", href: "/admin/categories", icon: Layers },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary text-white hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <span className="font-serif text-xl font-bold text-gold tracking-wider">AURUM</span>
                    <span className="ml-2 text-xs text-white/50 uppercase tracking-widest">Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive
                                        ? "bg-gold/10 text-gold border-r-2 border-gold"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white/70 hover:text-red-400 hover:bg-red-900/10 gap-2 px-4"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header (TODO if needed) */}
                <div className="md:hidden h-16 bg-secondary text-white flex items-center px-4 justify-between">
                    <span className="font-serif font-bold text-gold">AURUM ADMIN</span>
                    <Button variant="ghost" size="icon" onClick={logout} className="text-white"><LogOut className="h-5 w-5" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
