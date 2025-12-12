"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/db";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalProducts: 0, activeCategories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-medium text-secondary">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-secondary/60 text-sm font-medium uppercase tracking-wider">Total Products</h3>
                    <p className="text-3xl font-serif text-secondary mt-2">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalProducts}
                    </p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-secondary/60 text-sm font-medium uppercase tracking-wider">Active Categories</h3>
                    <p className="text-3xl font-serif text-secondary mt-2">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeCategories}
                    </p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-secondary/60 text-sm font-medium uppercase tracking-wider">System Status</h3>
                    <p className="text-3xl font-serif text-green-600 mt-2">Active</p>
                </div>
            </div>

            <div className="bg-white p-8 border border-gray-100 shadow-sm text-center py-20">
                <p className="text-secondary/50">Select "Products" from the sidebar to manage your inventory.</p>
            </div>
        </div>
    );
}
