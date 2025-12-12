import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "Contact Us | Agnivie",
    description: "Contact Agnivie for enquiries and orders.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-cream">
            {/* Header - Consistent with About & Collection */}
            <div className="bg-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide">Contact Us</h1>
                    <div className="h-1 w-16 bg-gold mx-auto mt-6" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                        {/* Left Column: Contact Info */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-serif text-secondary">Get in Touch</h2>
                                <p className="text-secondary/70 leading-relaxed font-light text-lg">
                                    We would love to hear from you. Whether it's a query about our collection or a custom order request, our team is here to assist.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 p-4 border border-gold/10 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-3 bg-secondary/5 rounded-full">
                                        <Phone className="h-6 w-6 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-secondary mb-1">Call Us</h4>
                                        <a href="tel:+918961806531" className="text-secondary/70 hover:text-gold transition-colors font-sans text-lg">
                                            +91 89618 06531
                                        </a>
                                        <p className="text-xs text-secondary/40 mt-1 uppercase tracking-wider">Mon-Sat 10:30 AM - 8:30 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border border-gold/10 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-3 bg-secondary/5 rounded-full">
                                        <Mail className="h-6 w-6 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-secondary mb-1">Email Us</h4>
                                        <a href="mailto:soultaker0210@gmail.com" className="text-secondary/70 hover:text-gold transition-colors font-sans text-lg">
                                            soultaker0210@gmail.com
                                        </a>
                                        <p className="text-xs text-secondary/40 mt-1 uppercase tracking-wider">For Business Enquiries</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border border-gold/10 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-3 bg-secondary/5 rounded-full">
                                        <MapPin className="h-6 w-6 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-secondary mb-1">Location</h4>
                                        <p className="text-secondary/70 font-sans text-lg">
                                            Online Store
                                        </p>
                                        <p className="text-xs text-secondary/40 mt-1 uppercase tracking-wider">Based in India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Personal Shopping (WhatsApp) */}
                        <div className="bg-secondary text-white p-8 md:p-12 relative overflow-hidden">
                            {/* Decorative Background Circle */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-serif text-gold mb-2">Personal Shopping</h3>
                                    <div className="h-0.5 w-12 bg-gold/50 mb-6" />
                                    <p className="text-white/80 leading-relaxed font-light">
                                        Looking for something specific? Need help with sizing or styling?
                                    </p>
                                    <p className="text-white/80 leading-relaxed font-light mt-4">
                                        Chat directly with our team for a personalized shopping experience. We customize orders to your preference.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <a href="https://wa.me/918961806531" target="_blank" rel="noopener noreferrer" className="block w-full">
                                        <Button variant="outline" size="lg" className="w-full text-white border-gold hover:bg-gold hover:text-secondary h-16 text-lg gap-3">
                                            <span>Chat on WhatsApp</span>
                                        </Button>
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                                    <div>
                                        <h5 className="text-gold font-serif text-lg">Fast</h5>
                                        <p className="text-white/60 text-sm">Response Time</p>
                                    </div>
                                    <div>
                                        <h5 className="text-gold font-serif text-lg">Custom</h5>
                                        <p className="text-white/60 text-sm">Orders Accepted</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
