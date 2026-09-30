import { Suspense } from "react";
import BookingLandingClient from "@/components/booking/BookingLandingClient";

export const metadata = {
  title: "Book a Hotel — Elgaa Real Estate",
  description:
    "Book premium hotel stays across Jos Plateau and Abuja. Select your hotel, dates, and guests to get started.",
};

export default function BookingPage() {
  return (
    <Suspense>
      <BookingLandingClient />
    </Suspense>
  );
}
