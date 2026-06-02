import React from "react";
import { MapPin, Bed, Users, ArrowUpRight, Star } from "lucide-react";
import { Accommodation } from "../types";

interface AccommodationCardProps {
  accommodation: Accommodation;
  imageUrls: string[];
  ratings?: number;
  featured?: boolean;
  onSelect: (item: Accommodation) => void;
  language?: "pt" | "en";
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  imageUrls,
  ratings = 4.9,
  featured = false,
  onSelect,
  language = "pt"
}) => {
  const coverImage = imageUrls.length > 0 
    ? imageUrls[0] 
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"; // fallback
  const text = (pt: string, en: string) => language === "pt" ? pt : en;
  const countryName = accommodation.country.toLowerCase() === "mozambique" && language === "pt"
    ? "Moçambique"
    : accommodation.country;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#c0c9c2]/20 flex flex-col h-full">
      <div className="relative h-72 overflow-hidden bg-[#e2e2e2]">
        <img 
          src={coverImage} 
          alt={accommodation.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {featured && (
          <div className="absolute top-4 left-4 bg-[#023625] text-[#bceed3] px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
            {text("Destaque", "Featured")}
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[#023625] font-bold text-xs shadow-sm flex items-center gap-1">
          <Star size={12} className="fill-[#7b580b] text-[#7b580b]" />
          <span>{ratings.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-[#414944] mb-2 text-xs font-semibold">
          <MapPin size={14} className="text-[#7b580b]" />
          <span>{accommodation.city}, {countryName}</span>
        </div>

        <h3 className="font-display font-bold text-xl text-[#023625] mb-3 leading-snug group-hover:text-[#7b580b] transition-colors">
          {accommodation.name}
        </h3>

        <div className="flex items-center gap-6 mb-6 border-y border-[#c0c9c2]/30 py-3 text-xs text-[#414944] select-none">
          <div className="flex items-center gap-1.5">
            <Bed size={16} className="text-[#023625]" />
            <span>
              {accommodation.bedrooms} {accommodation.bedrooms === 1 ? text("Quarto", "Room") : text("Quartos", "Rooms")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-[#023625]" />
            <span>{text("Até", "Up to")} {accommodation.max_guests} {text("Hóspedes", "Guests")}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-2">
          <div>
            <span className="text-xl font-bold font-display text-[#023625]">
              {accommodation.price_per_night.toLocaleString("pt-MZ")} MT
            </span>
            <span className="text-[#414944] text-[11px] block mt-0.5 font-sans uppercase tracking-wider">
              {text("por noite", "per night")}
            </span>
          </div>
          <button 
            onClick={() => onSelect(accommodation)}
            className="text-[#023625] hover:text-[#7b580b] font-bold text-sm flex items-center gap-1 transition-colors group/btn"
          >
            <span>{text("Ver Detalhes", "View Details")}</span>
            <ArrowUpRight size={16} className="transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
