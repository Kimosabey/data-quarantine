import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataQuarantine - Streaming Schema Enforcer",
  description: "Production-grade streaming schema validation and data quality monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Sidebar />
          <Header />
          <main className="ml-64 mt-16 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
