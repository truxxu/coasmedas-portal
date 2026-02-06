import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/src/contexts";

const cabin = Cabin({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-cabin",
});

const geistSans = cabin;
const geistMono = cabin;

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
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
