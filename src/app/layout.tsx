import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

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
  title: "Together AI - Next Chat",
  description: "Quickstart for Together AI + Next.js",
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
        <header className="text-sm font-medium">
          <div className="mx-auto flex max-w-6xl gap-4 px-4 py-4">
            <div>Together AI Solutions</div>

            <div className="ml-auto">
              <a
                href="https://github.com/samselikoff/together-nextjs-chat"
                className="text-gray-500 hover:text-gray-900"
              >
                <GitHubLogoIcon width="20" height="20" />
              </a>
            </div>
          </div>
        </header>

        <main className="flex grow flex-col">{children}</main>
      </body>
    </html>
  );
}
