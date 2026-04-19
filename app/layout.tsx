import { Inter } from "next/font/google";
import "./globals.css";
import type { FunctionComponent, ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
