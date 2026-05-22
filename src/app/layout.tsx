import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// Inter có hỗ trợ subset "vietnamese" nên giữ nguyên được
const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: "--font-inter" 
});

// SỬA LẠI ĐOẠN NÀY: Chỉ để "latin"
const poppins = Poppins({ 
  weight: ["400", "600", "700"], 
  subsets: ["latin"], // Poppins hiển thị tiếng Việt tốt trong subset latin
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "Vòng quay kết nối tình cảm Ngôi Sao",
  description: "Minigame vòng quay cho những người may mắn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-[#FFFBEB] text-[#1A1A1A] overflow-x-hidden min-h-screen`}>
        {children}
      </body>
    </html>
  );
}