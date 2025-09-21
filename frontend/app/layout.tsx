// layout.tsx

import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-zinc-900 text-white">
        <Navbar />
        {/* Biarkan <main> menjadi container sederhana. 
            Tinggi dan layout-nya akan diatur oleh page.tsx */}
        <main>{children}</main>
      </body>
    </html>
  );
}