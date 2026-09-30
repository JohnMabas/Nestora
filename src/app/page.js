import Hero               from "@/components/home/Hero";
import PropertySearch      from "@/components/home/PropertySearch";
import FeaturedProperties  from "@/components/home/FeaturedProperties";
import RecentProperties    from "@/components/home/RecentProperties";
import PropertyCategories  from "@/components/home/PropertyCategories";
import HotelDiscovery      from "@/components/home/HotelDiscovery";
import WhyChooseUs         from "@/components/home/WhyChooseUs";
import Testimonials        from "@/components/home/Testimonials";
import CTA                 from "@/components/home/CTA";

export const metadata = {
  title: "Elgaa Real Estate — Premium Properties & Hotel Booking in Jos & Abuja",
  description:
    "Discover luxury properties for sale and rent, and book the finest hotels in Jos Plateau and Abuja — all on one beautifully curated platform.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Property search */}
      <PropertySearch />

      {/* 3. Featured properties */}
      <FeaturedProperties />

      {/* 4. Recent properties */}
      <RecentProperties />

      {/* 5. Property categories */}
      <PropertyCategories />

      {/* 6. Hotel destinations + featured hotels */}
      <HotelDiscovery />

      {/* 7. Why choose us */}
      <WhyChooseUs />

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. CTA */}
      <CTA />
    </>
  );
}
