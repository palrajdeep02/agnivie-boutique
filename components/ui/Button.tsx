"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "whatsapp" | "destructive";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "relative overflow-hidden bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-[length:200%_auto] text-black shadow-md hover:bg-right transition-all duration-500 hover:shadow-lg hover:scale-[1.02]",
            outline: "bg-transparent border border-gold text-secondary hover:bg-gold/10 hover:border-[#B59020] transition-colors",
            ghost: "bg-transparent text-secondary hover:bg-gold/5 hover:text-gold transition-colors",
            whatsapp: "bg-secondary text-white border border-secondary hover:border-gold hover:text-gold shadow-md hover:shadow-lg transition-all duration-300",
            destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs tracking-wider uppercase",
            md: "h-11 px-6 text-sm tracking-widest uppercase",
            lg: "h-14 px-8 text-base tracking-widest uppercase",
            icon: "h-10 w-10 p-2",
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-none font-serif font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
