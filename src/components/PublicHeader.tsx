import React, { useState, useRef } from "react";
import { Home } from "lucide-react";

interface PublicHeaderProps {
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
  onOpenAbout?: () => void;
  language?: "pt" | "en";
  onLanguageChange?: (language: "pt" | "en") => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ 
  onNavigate, 
  onOpenAdmin, 
  onOpenAbout,
  language = "pt",
  onLanguageChange
}) => {
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);
  const text = (pt: string, en: string) => language === "pt" ? pt : en;

  const handleLogoClick = () => {
    onNavigate("hero");
    const now = Date.now();
    if (now - lastClickTime.current > 3000) {
      // Reset if more than 3 seconds since last click
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 5) {
        onOpenAdmin();
        setClickCount(0); // Reset after success
      }
    }
    lastClickTime.current = now;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#c0c9c2]/30 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Brand Logo & Name */}
        <div 
          onClick={handleLogoClick} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#023625] rounded-lg flex items-center justify-center text-white transition-all transform group-hover:scale-105">
            <Home size={20} className="text-[#a1d1b8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl md:text-2xl text-[#023625] tracking-tight leading-none">
              Enclave
            </span>
            <span className="font-sans text-[10px] text-[#7b580b] tracking-wider uppercase font-semibold leading-none mt-1">
              Accommodation
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate("hero")} 
            className="font-sans font-semibold text-sm text-[#023625] hover:text-[#7b580b] transition-colors"
          >
            {text("Início", "Home")}
          </button>
          <button 
            onClick={() => onNavigate("acomodacoes")} 
            className="font-sans font-semibold text-sm text-[#414944] hover:text-[#023625] transition-colors"
          >
            {text("Acomodações", "Stays")}
          </button>
          <button 
            onClick={onOpenAbout} 
            className="font-sans font-semibold text-sm text-[#414944] hover:text-[#023625] transition-colors"
          >
            {text("Sobre Nós", "About")}
          </button>
          <button 
            onClick={onOpenAbout} 
            className="font-sans font-semibold text-sm text-[#414944] hover:text-[#023625] transition-colors"
          >
            {text("Contactos", "Contacts")}
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onLanguageChange && (
            <div className="hidden sm:flex items-center rounded-lg border border-[#c0c9c2]/60 bg-white overflow-hidden">
              {(["pt", "en"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => onLanguageChange(item)}
                  className={`px-3 py-2 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    language === item ? "bg-[#023625] text-white" : "text-[#414944] hover:bg-[#f3f3f3]"
                  }`}
                  aria-pressed={language === item}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          <button 
            onClick={() => onNavigate("acomodacoes")} 
            className="bg-[#023625] text-white px-5 py-2.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#1f4d3a] transition-all transform hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
          >
            {text("Reservar Agora", "Book Now")}
          </button>
        </div>
      </div>
    </header>
  );
};
