import { SpinHistory } from "@/types";

interface HistoryListProps {
  history: SpinHistory[];
}

export default function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center gap-4 z-10 animate-in slide-in-from-bottom duration-500">
      <div className="w-full bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2 px-1 border-b border-black/5 pb-2">
          <span className="text-lg">🏆</span>
          <span className="text-xs md:text-sm font-black text-red-600 uppercase tracking-wider">
            Lịch sử may mắn (5 lượt gần nhất)
          </span>
        </div>

        {/* Danh sách 5 item: Mobile scroll, Desktop center */}
        <div className="flex gap-3 overflow-x-auto md:justify-center pb-2 scrollbar-hide">
          {history.map((h, i) => (
            <div
              key={h.id}
              className={`shrink-0 px-4 py-3 rounded-xl border flex flex-col justify-center min-w-[130px] max-w-[180px] transition-all relative group ${
                i === 0
                  ? "bg-yellow-100 border-yellow-400 shadow-md scale-105" // Item mới nhất to hơn xíu
                  : "bg-white/80 border-gray-200 opacity-90 hover:opacity-100"
              }`}
            >
              {/* Badge "MỚI" cho item đầu tiên */}
              {i === 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  MỚI
                </span>
              )}
              
              <div className="flex items-center gap-1 opacity-60 mb-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
                  {h.timestamp}
                </span>
              </div>
              <span
                className={`text-xs md:text-sm font-bold leading-tight line-clamp-2 ${
                  i === 0 ? "text-red-700" : "text-gray-800"
                }`}
              >
                {h.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}