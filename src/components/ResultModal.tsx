import { WheelItem } from "@/types";

export default function ResultModal({ item, onClose }: { item: WheelItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.5)] w-full max-w-lg transform transition-all animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-xl p-8 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-4 animate-bounce">🎉 OH YEAH! 🎉</h2>
          
          <div className="my-6 p-6 bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300 w-full">
            <p className="text-2xl md:text-4xl font-bold text-neutral-800 uppercase leading-tight">
              {item.text}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-8 py-3 bg-red-600 text-white font-bold text-xl rounded-full hover:bg-red-700 transition-colors shadow-lg active:scale-95"
          >
            OK – Quay tiếp
          </button>
        </div>
      </div>
    </div>
  );
}