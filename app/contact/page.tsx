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
            {/* Header */}
            <div className="bg-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide">Contact Us</h1>
                    <div className="h-1 w-16 bg-gold mx-auto mt-6" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Contact Details */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-serif text-secondary mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-gold mt-1" />
                                    <div>
                                        <h4 className="font-medium text-secondary">Location</h4>
                                        <p className="text-secondary/70">Online Store based in India</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-gold mt-1" />
                                    <div>
                                        <h4 className="font-medium text-secondary">Call Us</h4>
                                        <a href="tel:+918961806531" className="text-secondary/70 hover:text-gold transition-colors">+91 89618 06531</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-gold mt-1" />
                                    <div>
                                        <h4 className="font-medium text-secondary">Email Us</h4>
                                        <a href="mailto:soultaker0210@gmail.com" className="text-secondary/70 hover:text-gold transition-colors">soultaker0210@gmail.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-gold mt-1" />
                                    <div>
                                        <h4 className="font-medium text-secondary">Opening Hours</h4>
                                        <p className="text-secondary/70">Mon - Sat: 10:30 AM - 8:30 PM<br />Sunday: By Appointment Only</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-serif text-secondary mb-6">Order via WhatsApp</h2>
                            <p className="text-secondary/60 mb-4">Have a specific requirement or want to customize? Chat with us directly.</p>
                            <a href="https://wa.me/918961806531" target="_blank" rel="noopener noreferrer">
                                <Button variant="whatsapp" size="lg">Chat on WhatsApp</Button>
                            </a>
                        </div>
                    </div>

                    {/* Map Embed (Placeholder) */}
                    <div className="h-full min-h-[400px] bg-gray-200 border border-gray-300 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.8340324203106!2d77.21443657618956!3d28.604753085352886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2db961be393%3A0xf6c24c7506e87f16!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1709665492471!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />
                    </div>

                </div>
            </div>
        </main>
    );
}
