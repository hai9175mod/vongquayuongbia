"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Wheel from "@/components/Wheel";
import AdminPanel from "@/components/AdminPanel";
import HistoryList from "@/components/HistoryList";
import { DEFAULT_ITEMS } from "@/utils/data";
import { WheelItem, SpinHistory } from "@/types";

export default function Home() {
  const [items, setItems] = useState<WheelItem[]>([]);
  const [history, setHistory] = useState<SpinHistory[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load Items
    const storedItems = localStorage.getItem("wheelItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems(DEFAULT_ITEMS);
    }

    // Load History & Force Limit 5
    const storedHistory = localStorage.getItem("spinHistory");
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // FIX: Luôn cắt lấy 5 item mới nhất ngay khi load
        setHistory(Array.isArray(parsedHistory) ? parsedHistory.slice(0, 5) : []);
      } catch (e) {
        setHistory([]); // Nếu lỗi data thì reset về rỗng
      }
    }
  }, []);

  // Update Items từ Admin
  const handleUpdateItems = (newItems: WheelItem[]) => {
    setItems(newItems);
    localStorage.setItem("wheelItems", JSON.stringify(newItems));
  };

  // Logic khi quay xong (Quan trọng)
  const handleSpinEnd = (result: WheelItem) => {
    const newHistoryEntry: SpinHistory = {
      id: Date.now(),
      text: result.text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
    };
    
    // FIX: Lấy item mới + history cũ -> Cắt lấy đúng 5 item đầu tiên
    const newHistory = [newHistoryEntry, ...history].slice(0, 5);
    
    setHistory(newHistory);
    localStorage.setItem("spinHistory", JSON.stringify(newHistory));
  };

  // Reset toàn bộ từ Admin (truyền prop này xuống AdminPanel)
  const handleResetData = () => {
    setItems(DEFAULT_ITEMS);
    setHistory([]); // Xóa sạch lịch sử
    localStorage.setItem("wheelItems", JSON.stringify(DEFAULT_ITEMS));
    localStorage.removeItem("spinHistory"); // Xóa trong storage
  };

  const confetti = Array.from({ length: 40 }).map((_, i) => ({
    id: i, left: `${Math.random() * 100}%`, duration: `${Math.random() * 3 + 2}s`,
    drift: `${Math.random() * 200 - 100}px`, colorClass: ['c-red', 'c-yellow', 'c-blue', 'c-green'][i%4], delay: `${Math.random() * 5}s`
  }));

  if (!isClient) return null;

  return (
    <main className="min-h-screen w-full flex flex-col items-center relative pb-10">
      <div className="confetti-container">
        {confetti.map((c) => (
          <div key={c.id} className={`confetti ${c.colorClass}`} style={{ left: c.left, "--duration": c.duration, "--drift": c.drift, animationDelay: c.delay } as any} />
        ))}
      </div>

      <header className="w-full pt-4 pb-2 px-4 flex flex-col items-center z-10">
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top duration-500">
          <div className="relative w-14 h-14 md:w-20 md:h-20 shrink-0 drop-shadow-md">
             <Image src="/logo-ngoi-sao.png" alt="Logo" fill className="object-contain"/>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-gray-600 font-sans font-bold uppercase text-[10px] md:text-sm tracking-widest mb-0.5">
              Công Ty CP Ngôi Sao Hồ Chí Minh
            </h2>
            <h1 className="font-heading font-black text-3xl md:text-6xl uppercase leading-none text-gradient-fire">
              COMPANY TRIP 2026
            </h1>
            <p>23/05/2026,<span className="font-bold"> Mũi Né - Phan Thiết</span></p>
           
          
          </div>
        </div>
      </header>

      <div className="w-full px-2 flex-grow flex flex-col items-center justify-center z-10 my-2">
         <Wheel items={items} onSpinEnd={handleSpinEnd} isSpinning={isSpinning} setIsSpinning={setIsSpinning} />
      </div>

      <HistoryList history={history} />
        
      <div className="mt-4 z-10">
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="px-4 py-2 bg-gray-200/50 hover:bg-white backdrop-blur-sm rounded-full text-gray-500 hover:text-red-600 text-xs font-bold transition-all border border-transparent hover:border-red-200 shadow-sm flex items-center gap-2"
        >
          ⚙️ Cài đặt Admin
        </button>
      </div>

      {/* Truyền thêm onReset xuống AdminPanel */}
      <AdminPanel 
        items={items} 
        setItems={handleUpdateItems} 
        isOpen={isAdminOpen} 
        setIsOpen={setIsAdminOpen}
        onReset={handleResetData} 
      />
    </main>
  );
}