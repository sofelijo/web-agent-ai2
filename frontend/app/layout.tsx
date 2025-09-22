// layout.tsx

import "./globals.css";
import Navbar from "@/components/Navbar";

// 👉 Tambahkan ini untuk title & SEO
export const metadata = {
  title: "ASKA - Agent AI Sekolah Kita",
  description: "ASKA adalah asisten AI SDN Semper Barat 01 yang siap bantu info sekolah seperti SPMB, KJP, jadwal, dan lainnya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-zinc-900 text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
