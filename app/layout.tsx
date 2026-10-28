import type { Metadata } from "next";
import { Jost as Font } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "StudyStash",
    description: "Convenience is key",
};

const font = Font({subsets: ['latin']});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={font.className}>
          {children}
        </body>
      </html>
  );
}
