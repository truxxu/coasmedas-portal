import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

const geistSans = ubuntu;
const geistMono = ubuntu;

export const metadata: Metadata = {
  title: "Portal Transaccional Coasmedas",
  description: "Portal Transaccional Coasmedas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
