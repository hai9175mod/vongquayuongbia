"use client";

import { useState, useEffect, useRef } from "react";
import { WheelItem } from "@/types";
import { COLORS } from "@/utils/data";
import ResultModal from "./ResultModal";

interface WheelProps {
  items: WheelItem[];
  onSpinEnd: (item: WheelItem) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
}

export default function Wheel({ items, onSpinEnd, isSpinning, setIsSpinning }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [activeItem, setActiveItem] = useState<WheelItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  const activeItems = items.filter((i) => i.enabled);
  const totalItems = activeItems.length;
  const segmentAngle = 360 / totalItems;
  const radius = 50; 
  const center = 50;

  useEffect(() => {
    spinAudioRef.current = new Audio("/sounds/spin.mp3");
    winAudioRef.current = new Audio("/sounds/win.mp3");
    if (spinAudioRef.current) spinAudioRef.current.volume = 0.6;
    if (winAudioRef.current) winAudioRef.current.volume = 1.0;
  }, []);

  const handleSpin = () => {
    if (isSpinning || totalItems === 0) return;
    setIsSpinning(true); 
    setShowModal(false);
    
    if (spinAudioRef.current) { 
        spinAudioRef.current.loop = true; 
        spinAudioRef.current.currentTime = 0; 
        spinAudioRef.current.play().catch(() => {}); 
    }

    const randomIndex = Math.floor(Math.random() * totalItems);
    const selectedItem = activeItems[randomIndex];
    
    // --- LOGIC GÓC QUAY MỚI (CHÍNH XÁC 100%) ---
    // 1. Góc hiện tại của item trong vòng tròn (tính từ 0 độ SVG - hướng 3h)
    // Tâm của ô item nằm ở: startAngle + nửa ô
    const itemCenterAngle = (randomIndex * segmentAngle) + (segmentAngle / 2);
    
    // 2. Mục tiêu: Đưa itemCenterAngle về vị trí Kim (Hướng 12h = 270 độ)
    // Cần xoay thêm một góc là delta để: (itemCenterAngle + delta) % 360 = 270
    // => delta = 270 - itemCenterAngle
    
    // 3. Cộng thêm số vòng quay (5 vòng * 360)
    const extraSpins = 5 * 360;
    
    // 4. Random Jitter: Lệch nhẹ trái phải trong ô để không quá cứng nhắc
    // Giới hạn jitter trong khoảng 80% độ rộng ô để kim không chỉ sang ô khác
    const jitter = (Math.random() - 0.5) * (segmentAngle * 0.8);

    // 5. Tính góc quay tuyệt đối mới (cộng dồn vào rotation hiện tại để xoay mượt tiếp)
    // Reset phần dư của rotation hiện tại về 0 để tính toán dễ hơn, sau đó cộng dồn
    const currentBase = rotation - (rotation % 360); 
    const newRotation = currentBase + extraSpins + (270 - itemCenterAngle) + jitter;

    setRotation(newRotation);

    setTimeout(() => {
      if (spinAudioRef.current) { 
          spinAudioRef.current.pause(); 
          spinAudioRef.current.currentTime = 0; 
      }
      setIsSpinning(false);
      setTimeout(() => {
          if (winAudioRef.current) winAudioRef.current.play().catch(() => {});
          setActiveItem(selectedItem);
          setShowModal(true);
      }, 1000); // Delay 1s hiện popup
    }, 5000);
  };

  const getSectorPath = (index: number) => {
    const startAngle = index * segmentAngle;
    const endAngle = (index + 1) * segmentAngle;
    const startRad = (startAngle) * (Math.PI / 180);
    const endRad = (endAngle) * (Math.PI / 180);
    const x1 = center + radius * Math.cos(startRad); 
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad); 
    const y2 = center + radius * Math.sin(endRad);
    return `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Container Vòng quay: FIX aspect-square để luôn tròn */}
      <div className="relative w-full max-w-[500px] md:max-w-[600px] aspect-square p-4">
        
        {/* KIM QUAY GIỌT NƯỚC (Giữ nguyên) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
           <svg width="60" height="80" viewBox="0 0 24 24" fill="none" className="w-14 h-20 md:w-20 md:h-28">
                <defs>
                    <linearGradient id="pinGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                </defs>
                <path d="M12 2C7.58 2 4 5.58 4 10C4 15 12 22 12 22C12 22 20 15 20 10C20 5.58 16.42 2 12 2Z" fill="url(#pinGradient)" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="9" r="3" fill="white" className="shadow-sm"/>
                <circle cx="12" cy="9" r="1.5" fill="#DC2626"/>
           </svg>
        </div>

        {/* KHUNG VÒNG QUAY TRÒN TUYỆT ĐỐI */}
        <div className="w-full h-full rounded-full border-[10px] md:border-[16px] border-white shadow-2xl overflow-hidden relative bg-white box-border">
          <div
            className="w-full h-full relative wheel-spin-transition"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full absolute top-0 left-0">
                {activeItems.map((item, index) => (
                    <path key={`path-${item.id}`} d={getSectorPath(index)} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth="0.8" />
                ))}
            </svg>

            {/* TEXT TRONG Ô */}
            {activeItems.map((item, index) => {
                const angle = index * segmentAngle + segmentAngle / 2;
                return (
                    <div
                        key={`text-${item.id}`}
                        className="absolute top-1/2 left-1/2 h-0 w-[50%] pointer-events-none origin-left flex items-center"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        <div className="pl-8 md:pl-14 w-full origin-left" style={{ transform: 'scaleX(1.1)' }}>
                            <span 
                                className="block font-sans font-black text-[#111] uppercase text-[10px] md:text-[14px] leading-none whitespace-nowrap truncate pr-2 text-shadow-sm"
                                style={{ 
                                    transform: 'scale(0.85) perspective(100px) rotateY(5deg)',
                                    transformOrigin: 'left center'
                                }}
                            >
                                {item.text}
                            </span>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>

        {/* NÚT QUAY */}
        <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-full border-[4px] md:border-[6px] border-yellow-400 shadow-xl z-20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
             <span className="text-white font-heading font-black text-lg md:text-2xl uppercase drop-shadow-md">QUAY</span>
        </button>
      </div>

      {showModal && activeItem && (<ResultModal item={activeItem} onClose={() => setShowModal(false)} />)}
    </div>
  );
}