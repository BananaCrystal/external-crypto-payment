import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "BananaCrystal External Payment",
  description:
    "Accept Stablecoin Payments Seamlessly & Watch Your Business Soar | Global Reach | No Chargebacks | Immediate Settlement | Eliminate Processing Fees",
  openGraph: {
    title: "BananaCrystal External Payment",
    description:
      "Accept Stablecoin Payments Seamlessly & Watch Your Business Soar | Global Reach | No Chargebacks | Immediate Settlement | Eliminate Processing Fees",
    url: "https://payment.bananacrystal.com/", 
    siteName: "BananaCrystal External Payment",
    images: [
      {
        url: "http://www.bananacrystal.com/wp-content/uploads/2025/06/Image-Color-Scheme-Request.png",
        width: 1200,
        height: 630,
        alt: "BananaCrystal External Payment Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BananaCrystal External Payment",
    description:
      "Accept Stablecoin Payments Seamlessly & Watch Your Business Soar | Global Reach | No Chargebacks | Immediate Settlement | Eliminate Processing Fees",
    images: [
      "http://www.bananacrystal.com/wp-content/uploads/2025/06/Image-Color-Scheme-Request.png",
    ],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
