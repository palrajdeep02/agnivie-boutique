import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Agnivie",
    description: "Discover the story behind Agnivie - Threads of Tradition, Touch of Today.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-secondary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide">Our Story</h1>
                    <div className="h-1 w-16 bg-gold mx-auto mt-6" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Introduction */}
                    <section className="text-center space-y-6">
                        <h2 className="text-3xl font-serif text-secondary">A Legacy of Elegance</h2>
                        <p className="text-lg text-secondary/70 leading-relaxed font-light">
                            <span className="text-gold font-medium">Agnivie</span> began with a simple mission:
                            to blend the timeless beauty of Indian traditions with the comfort of everyday fashion.
                            "Threads of Tradition, Touch of Today" is not just our tagline, it is our promise.
                        </p>
                    </section>

                    {/* Image Placeholder */}
                    <div className="aspect-video bg-gray-200 w-full relative overflow-hidden rounded-lg shadow-xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
                            style={{ backgroundImage: 'url("/images/about-story.png")' }}
                        />
                    </div>

                    {/* Philosophy */}
                    <section className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif text-secondary">Our Philosophy</h3>
                            <p className="text-secondary/70 leading-relaxed">
                                We curate soft fabrics and timeless styles that are affordable and elegant.
                                From daily wear to special occasions, our collection is designed for the modern woman who values both comfort and grace.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif text-secondary">The Experience</h3>
                            <p className="text-secondary/70 leading-relaxed">
                                Shopping at Agnivie is personal. Whether you are looking for that perfect saree or a
                                comfortable kurti, we are here to assist you.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
