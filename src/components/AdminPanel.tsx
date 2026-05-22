"use client";
import { useState } from "react";
import { WheelItem } from "@/types";

interface AdminProps {
  items: WheelItem[];
  setItems: (items: WheelItem[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onReset: () => void; // Thêm prop này
}

export default function AdminPanel({ items, setItems, isOpen, setIsOpen, onReset }: AdminProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newItemText, setNewItemText] = useState("");

  const handleLogin = () => { if (password === "STAR") setIsAuthenticated(true); else alert("Sai mật khẩu!"); };

  const toggleItem = (id: number) => { setItems(items.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i)); };
  const updateText = (id: number, text: string) => { setItems(items.map(i => i.id === id ? { ...i, text } : i)); };
  const deleteItem = (id: number) => { if(confirm("Xóa nhé?")) setItems(items.filter(i => i.id !== id)); }
  
  const addItem = () => {
    if (!newItemText.trim()) return;
    setItems([...items, { id: Date.now(), text: newItemText, enabled: true }]);
    setNewItemText("");
  };

  const handleResetClick = () => {
    const confirmReset = confirm("⚠️ RESET TOÀN BỘ?\n- Dữ liệu vòng quay về mặc định\n- Xóa sạch lịch sử trúng thưởng\n\nBạn chắc chứ?");
    if (confirmReset) {
      onReset(); // Gọi hàm reset từ cha
      alert("Đã reset sạch sẽ!");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-gray-900 text-xl font-black uppercase flex items-center gap-2">
            ⚙️ Admin Mode
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">Đóng [x]</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-4 items-center justify-center mt-20 p-8 bg-white rounded-xl shadow-sm max-w-sm mx-auto">
              <h3 className="text-gray-700 font-bold">Nhập mật khẩu quản trị</h3>
              <input type="password" className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-yellow-500 outline-none text-gray-900 font-bold text-center text-lg" placeholder="***" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
              <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all">Đăng nhập</button>
            </div>
          ) : (
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 border-b border-gray-100 pb-6">
                <div className="flex-1 flex gap-2">
                    <input className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-green-500 outline-none text-gray-900" placeholder="Thêm thử thách mới..." value={newItemText} onChange={e => setNewItemText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()}/>
                    <button onClick={addItem} className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 rounded-lg shadow-md whitespace-nowrap active:scale-95 transition-transform">Thêm +</button>
                </div>
                
                {/* NÚT RESET - ĐÃ GỌI HÀM MỚI */}
                <button 
                    onClick={handleResetClick}
                    className="bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center"
                >
                    🔄 Reset toàn bộ
                </button>
              </div>

              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                Tổng cộng: {items.length} ô ({items.filter(i => i.enabled).length} đang bật)
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${item.enabled ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    <input type="checkbox" checked={item.enabled} onChange={() => toggleItem(item.id)} className="w-6 h-6 accent-yellow-500 cursor-pointer"/>
                    <input className={`flex-1 bg-transparent border-none focus:ring-0 outline-none px-2 font-medium ${item.enabled ? 'text-gray-900' : 'text-gray-500 line-through'}`} value={item.text} onChange={(e) => updateText(item.id, e.target.value)}/>
                    <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-2 font-bold">Xóa</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}