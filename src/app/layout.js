import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default:  "EstateOne — Premium Real Estate & Hotel Booking in Nigeria",
    template: "%s | EstateOne",
  },
  description:
    "Nigeria's premier platform for luxury property sales, rentals, and hotel bookings. Find your perfect place to live and stay.",
  keywords:   ["real estate", "properties", "hotels", "Lagos", "Abuja", "Nigeria", "buy property", "rent property"],
  metadataBase: new URL("https://estateone.ng"),
  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         "https://estateone.ng",
    siteName:    "EstateOne",
    title:       "EstateOne — Premium Real Estate & Hotel Booking in Nigeria",
    description: "Discover luxury properties and hotels across Nigeria.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "EstateOne" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "EstateOne — Premium Real Estate & Hotel Booking",
    description: "Discover luxury properties and hotels across Nigeria.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport = {
  themeColor: "#0a0b0d",
  width:      "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-surface-1)] text-[var(--color-text-primary)]">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
