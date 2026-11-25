import { Prata } from "next/font/google";
import "./globals.css";

const prata = Prata({ weight: "400", subsets: ["latin"] });

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL;

const metadataBase = new URL(
  configuredSiteUrl
    ? /^https?:\/\//.test(configuredSiteUrl)
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`
    : "http://localhost:3000"
);

const siteTitle = "Falita Music — Vocals that ring through time";
const siteDescription =
  "Discover Falita Music: music, live performances, past work, upcoming shows, and Falita’s story.";

export const metadata = {
  metadataBase,
  applicationName: "Falita Music",
  title: {
    default: siteTitle,
    template: "%s | Falita Music",
  },
  description: siteDescription,
  keywords: ["Hifalita", "Falita", "Falita Chowdhary", "singer", "live music"],
  alternates: {
    canonical: "/",
  },
  creator: "Falita Music",
  publisher: "Falita Music",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Falita Music",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/hifalita.jpeg",
        alt: "Falita performing live",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/hifalita.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return <html lang="en" className={`${prata.className} h-full antialiased`}><body className="min-h-full flex flex-col">{children}</body></html>;
}



