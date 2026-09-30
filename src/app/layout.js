import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { AgentAuthProvider } from "@/context/AgentAuthContext";

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
    default:  "Elgaa Real Estate — Premium Properties & Hotel Booking in Jos & Abuja",
    template: "%s | Elgaa Real Estate",
  },
  description:
    "Jos Plateau and Abuja's premier platform for luxury property sales, rentals, and hotel bookings. Find your perfect place to live and stay.",
  keywords:   ["real estate", "properties", "hotels", "Jos", "Abuja", "Plateau State", "Nigeria", "buy property", "rent property"],
  metadataBase: new URL("https://elgaa.ng"),
  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         "https://elgaa.ng",
    siteName:    "Elgaa Real Estate",
    title:       "Elgaa Real Estate — Premium Properties & Hotel Booking in Jos & Abuja",
    description: "Discover luxury properties and hotels in Jos Plateau and Abuja, Nigeria.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Elgaa Real Estate" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Elgaa Real Estate — Premium Properties & Hotel Booking",
    description: "Discover luxury properties and hotels in Jos Plateau and Abuja, Nigeria.",
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
        <AuthProvider>
          <AgentAuthProvider>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </AgentAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
