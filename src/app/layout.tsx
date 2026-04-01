import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/session-context";

export const metadata: Metadata = {
  title: "TCKR Systems — Justice Park Behavioral Operations",
  description: "TCKR Systems operates the Justice Park Behavioral Operations Program, delivering structured rehabilitation through precision environmental conditioning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
