"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats, getAnalyticsData } from "@/lib/db";
import { Loader2, Users, MessageCircle, Phone, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalProducts: 0, activeCategories: 0 });
    const [analytics, setAnalytics] = useState<any[]>([]); // Array of daily stats
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            const analyticsData = await getAnalyticsData(7); // Last 7 days
            setStats(data);
            setAnalytics(analyticsData);
            setLoading(false);
        };
        fetchStats();
    }, []);

    // Calculate Today's Stats from the analytics array (last item)
    const todayStats = analytics[analytics.length - 1] || { visits: 0, whatsapp_clicks: 0, call_clicks: 0 };

    // Find Max visits for graph scaling
    const maxVisits = Math.max(...analytics.map(d => d.visits || 0), 10); // Min 10 scale

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-secondary">Dashboard</h1>
                    <p className="text-secondary/60 mt-1 font-light">Welcome back to your boutique overview.</p>
                </div>
            </div>

            {/* --- TOP ROW: System Stats --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Stats */}
                <div className="bg-white p-6 rounded-xl border border-gold/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="h-16 w-16 bg-gold rounded-full blur-2xl"></div>
                    </div>
                    <h3 className="text-secondary/60 text-xs font-bold uppercase tracking-widest mb-1">Total Products</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-serif text-secondary font-medium">
                            {loading ? <Loader2 className="h-8 w-8 animate-spin text-gold" /> : stats.totalProducts}
                        </p>
                        <span className="text-xs text-green-600 font-medium">+ New</span>
                    </div>
                </div>

                {/* Category Stats */}
                <div className="bg-white p-6 rounded-xl border border-gold/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="h-16 w-16 bg-gold rounded-full blur-2xl"></div>
                    </div>
                    <h3 className="text-secondary/60 text-xs font-bold uppercase tracking-widest mb-1">Active Categories</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-serif text-secondary font-medium">
                            {loading ? <Loader2 className="h-8 w-8 animate-spin text-gold" /> : stats.activeCategories}
                        </p>
                        <span className="text-xs text-gold font-medium">Collections</span>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-secondary text-white p-6 rounded-xl border border-secondary shadow-md relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 h-24 w-24 bg-gold/20 rounded-full blur-xl"></div>
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">System Status</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
                        <p className="text-2xl font-serif font-medium">System Active</p>
                    </div>
                    <p className="text-white/40 text-xs mt-2">All servers operational</p>
                </div>
            </div>

            {/* --- MIDDLE ROW: Analytics (New) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Traffic Card */}
                <div className="bg-white p-6 rounded-xl border border-gold/20 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-serif font-medium text-secondary">Traffic Overview</h3>
                            <p className="text-sm text-gray-400">Visitor activity for the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 text-gold bg-gold/5 px-3 py-1 rounded-full">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-bold">{todayStats.visits || 0} Today</span>
                        </div>
                    </div>

                    {/* CSS Bar Chart */}
                    <div className="h-40 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {analytics.length === 0 && !loading && (
                            <div className="w-full text-center text-gray-300 text-sm">No traffic data yet</div>
                        )}
                        {analytics.map((day, i) => {
                            const heightPercent = Math.max((day.visits / maxVisits) * 100, 5); // Min 5% height
                            const isToday = i === analytics.length - 1;
                            const dateLabel = new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full bg-gray-100 rounded-t-sm h-full flex items-end overflow-hidden">
                                        <div
                                            style={{ height: `${heightPercent}%` }}
                                            className={`w-full transition-all duration-500 ${isToday ? 'bg-gold' : 'bg-secondary/20 group-hover:bg-secondary/40'}`}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {day.visits} Visits
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-medium ${isToday ? 'text-secondary' : 'text-gray-400'}`}>
                                        {dateLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leads Card */}
                <div className="bg-white p-6 rounded-xl border border-gold/20 shadow-sm flex flex-col">
                    <h3 className="text-lg font-serif font-medium text-secondary mb-1">Customer Leads</h3>
                    <p className="text-sm text-gray-400 mb-6">Interactions today</p>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-secondary">WhatsApp</p>
                                    <p className="text-xs text-gray-500">Chats initiated</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-green-700">{todayStats.whatsapp_clicks || 0}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-secondary">Phone Calls</p>
                                    <p className="text-xs text-gray-500">Calls initiated</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-blue-700">{todayStats.call_clicks || 0}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <div className="flex items-center justify-center gap-2 text-gold text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>{(todayStats.whatsapp_clicks || 0) + (todayStats.call_clicks || 0)} Total Leads Today</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
