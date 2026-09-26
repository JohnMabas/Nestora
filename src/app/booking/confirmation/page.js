import Container from "@/components/ui/Container";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

export const metadata = {
  title: "Booking Confirmed",
  description: "Your hotel booking has been confirmed. Thank you for choosing EstateOne.",
};

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <Container>
        <BookingConfirmation />
      </Container>
    </div>
  );
}
