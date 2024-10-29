import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col antialiased`}
      >
        <header className="bg-gray-100">
          <div className="mx-auto flex max-w-6xl gap-4 px-4 py-2">
            <Link href="/">Ask</Link>
            <Link href="/chat">Chat</Link>
          </div>
        </header>

        <main className="flex grow flex-col">{children}</main>

        <footer className="bg-gray-100">
          <div className="mx-auto flex max-w-6xl gap-4 px-4 py-6">
            <Link href="https://www.together.ai/">Powered by Together AI</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
