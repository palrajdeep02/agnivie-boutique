"use client";

import { useEffect, useRef } from "react";
import { logVisit } from "@/lib/db";

export default function AnalyticsTracker() {
    // strict mode safety: prevent double counting in dev
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // Check if already visited this session
        const hasVisited = sessionStorage.getItem("agnivie_visit_session");

        if (!hasVisited) {
            logVisit();
            sessionStorage.setItem("agnivie_visit_session", "true");
        }
    }, []);

    return null; // Component renders nothing
}
