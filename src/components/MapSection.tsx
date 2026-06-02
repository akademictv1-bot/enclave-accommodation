import React from "react";
import { ContactsSettings } from "../firebaseClient";

interface MapSectionProps {
  contacts: ContactsSettings | null;
  language?: "pt" | "en";
}

export function MapSection({ contacts, language = "pt" }: MapSectionProps) {
  const text = (pt: string, en: string) => language === "pt" ? pt : en;

  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Dynamic Map Coordinates Integration Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7b580b] bg-[#fdcd78]/20 px-3 py-1 rounded-full">
              {text("Presença Internacional", "International Presence")}
            </span>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#023625]">
              {text("Presença Regional Transfronteiriça", "Cross-Border Regional Presence")}
            </h3>
            <p className="text-xs md:text-sm text-[#414944] leading-relaxed">
              {text("Operamos com excelência e conforto no corredor de Beira, assegurando estadias inigualáveis tanto em território moçambicano como no Zimbabwe.", "We operate with excellence and comfort across the Beira corridor, ensuring exceptional stays in both Mozambique and Zimbabwe.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {/* Mozambique Map Card */}
            <div className="bg-[#fcfdfd] border border-gray-100 rounded-2xl overflow-hidden p-5 space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-label="Moçambique">🇲🇿</span>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[#023625] uppercase tracking-wide">
                      {text("Enclave Moçambique", "Enclave Mozambique")}
                    </h4>
                    <p className="text-[10px] font-mono font-semibold text-gray-400">
                      {text("Sede Administrativa Central", "Central Administrative Office")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Google Map Iframe using Dynamic Coordinate State */}
              <div className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-200 shadow-inner relative bg-gray-50">
                <iframe 
                  title="Mapa Enclave Moçambique"
                  src={`https://maps.google.com/maps?q=${contacts?.latitude_mz || "-19.1164"},${contacts?.longitude_mz || "33.4833"}&z=14&output=embed`}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 max-w-sm">
                  <span className="font-bold text-[#023625] block">{text("Endereço Oficial:", "Official Address:")}</span>
                  <span className="text-[#414944]/90 block">{contacts?.address || text("Avenida da Independência, Chimoio, Moçambique", "Independence Avenue, Chimoio, Mozambique")}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${contacts?.latitude_mz || "-19.1164"},${contacts?.longitude_mz || "33.4833"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#023625]/5 hover:bg-[#023625] hover:text-white text-[#023625] font-bold px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest text-center transition-all shrink-0"
                >
                  {text("Rotas no Maps", "Map Directions")}
                </a>
              </div>
            </div>

            {/* Zimbabwe Map Card */}
            <div className="bg-[#fcfdfd] border border-gray-100 rounded-2xl overflow-hidden p-5 space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-label="Zimbabwe">🇿🇼</span>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[#023625] uppercase tracking-wide">
                      Enclave Zimbabwe
                    </h4>
                    <p className="text-[10px] font-mono font-semibold text-gray-400">
                      {text("Expansão Regional e Turismo", "Regional Expansion and Tourism")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Google Map Iframe using Dynamic Coordinate State */}
              <div className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-200 shadow-inner relative bg-gray-50">
                <iframe 
                  title="Mapa Enclave Zimbabwe"
                  src={`https://maps.google.com/maps?q=${contacts?.latitude_zw || "-18.9701"},${contacts?.longitude_zw || "32.6685"}&z=14&output=embed`}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 max-w-sm">
                  <span className="font-bold text-[#023625] block">{text("Endereço Oficial:", "Official Address:")}</span>
                  <span className="text-[#414944]/90 block">{contacts?.address_zw || "Fife Street, Harare, Zimbabwe"}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${contacts?.latitude_zw || "-18.9701"},${contacts?.longitude_zw || "32.6685"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#023625]/5 hover:bg-[#023625] hover:text-white text-[#023625] font-bold px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest text-center transition-all shrink-0"
                >
                  {text("Rotas no Maps", "Map Directions")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
