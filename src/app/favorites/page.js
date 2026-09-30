import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FavoritesContent from "@/components/shared/FavoritesContent";

export const metadata = {
  title: "Saved — My Favourites",
  description: "View and manage your saved properties and hotels on Elgaa Real Estate.",
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <Container>
        <div className="mb-10">
          <SectionHeading
            eyebrow="Your Saves"
            title="Favourites"
            subtitle="Your saved properties and hotels, ready whenever you are."
          />
        </div>
        <FavoritesContent />
      </Container>
    </div>
  );
}
