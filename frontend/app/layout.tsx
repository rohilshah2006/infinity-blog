import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Infinity Blog",
  description: "A premium blog experience with infinite insights.",
  openGraph: {
    title: "Infinity Blog",
    description: "A premium blog experience with infinite insights.",
    url: "https://infinity-blog.tech",
    siteName: "Infinity Blog",
    images: [
      {
        url: "/api/og?title=Infinity Blog&author=The Future of Writing&accent=%23d97757",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Blog",
    description: "A premium blog experience with infinite insights.",
    images: ["/api/og?title=Infinity Blog&author=The Future of Writing&accent=%23d97757"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${lora.variable} antialiased bg-brand-light text-brand-dark min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
