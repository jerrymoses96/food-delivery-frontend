import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Food Delivery App",
  description:
    "Order delicious food from your favorite restaurants and get it delivered to your doorstep quickly and conveniently.",
  keywords:
    "food delivery, online ordering, restaurants, takeout, delivery service",
  author: "jerin ouseph", // Replace with your name or company name
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  mx-auto`}
      >
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Toaster />
              <Navbar />
              <div className="mx-auto w-[95%]">{children}</div>{" "}
              {/* Centered with 95% width */}
              <Footer />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
