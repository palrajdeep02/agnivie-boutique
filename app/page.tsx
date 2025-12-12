import { Hero } from "@/components/features/Hero";
import { CategoryGrid } from "@/components/features/CategoryGrid";
import { NewArrivals } from "@/components/features/NewArrivals";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <CategoryGrid />
      <NewArrivals />
    </main>
  );
}
