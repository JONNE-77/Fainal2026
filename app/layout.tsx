import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ລະບົບຈັດການບ້ານພັກ",
  description: "Guesthouse Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}