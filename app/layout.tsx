import type { Metadata } from "next";
import { Geist, Geist_Mono, Crimson_Text } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimsonText = Crimson_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Showup - Join the Waitlist | Accountability Challenges",
  description:
    "Join the Showup waitlist and be the first to access accountability challenges that help you achieve your goals. Turn personal challenges into real commitments.",
  keywords: ["accountability", "challenges", "goals", "habits", "productivity", "waitlist"],
  authors: [{ name: "Showup" }],
  creator: "Showup",
  publisher: "Showup",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://showup.app",
    siteName: "Showup",
    title: "Showup - Show up for your goals with real accountability",
    description:
      "Join the Showup waitlist and be the first to access accountability challenges that help you achieve your goals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Showup - Accountability Challenges Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Showup - Show up for your goals with real accountability",
    description:
      "Join the Showup waitlist and be the first to access accountability challenges that help you achieve your goals.",
    images: ["/og-image.png"],
    creator: "@showup",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/showup-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/showup-icon.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://showup.app",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://showup.app/#organization",
        name: "Showup",
        url: "https://showup.app",
        logo: {
          "@type": "ImageObject",
          url: "https://showup.app/showup-icon.svg",
        },
        sameAs: [
          "https://twitter.com/showup",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://showup.app/#website",
        url: "https://showup.app",
        name: "Showup",
        publisher: {
          "@id": "https://showup.app/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://showup.app/#webpage",
        url: "https://showup.app",
        name: "Showup - Join the Waitlist | Accountability Challenges",
        isPartOf: {
          "@id": "https://showup.app/#website",
        },
        about: {
          "@id": "https://showup.app/#organization",
        },
        description:
          "Join the Showup waitlist and be the first to access accountability challenges that help you achieve your goals.",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${crimsonText.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
