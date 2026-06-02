import React from "react";
import { ShieldCheck, Star, Check } from "lucide-react";
import { AboutSectionSettings, HostSettings } from "../firebaseClient";

interface AboutSectionProps {
  about: AboutSectionSettings | null;
  host: HostSettings | null;
  language?: "pt" | "en";
}

export function AboutSection({ about, host, language = "pt" }: AboutSectionProps) {
  const text = (pt: string, en: string) => language === "pt" ? pt : en;

  return (
    <section className="py-20 bg-[#f3f3f3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Host representation portrait on left */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white relative z-10">
            <img 
              src={host?.photo_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCYE1ZY8w9_dj9OARYmF1NLXNizhShKsMICFQ5EbGcXFfI4g7Yv1uJax-c0114B3dQxvNH9dgRenGeKunc0gSiM-tOevfNVkQNXBR_hTgqsPksX0sfNQx9LfIPTz4skoiXndip-0OkvboPRjVMfTSXmmKhd6dx3FfqEn2QPQhFC1YTub7wR624NFSoxAXyvka8xvaN7kzMF-XQDja35_FzVr6KmwxZQlQdgnLy4pr37mzudoqvKPKlSH8xh7u2WgpGqz5kuiNuML4U"} 
              alt={host?.name || "Anfitrião Enclave"} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#fdcd78]/30 rounded-full blur-3xl z-0" />
        </div>

        {/* Informative text column on right */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[#7b580b] font-sans font-semibold text-xs uppercase tracking-widest block">
            {language === "pt" ? (about?.title || "A nossa essência") : "Our Essence"}
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#023625]">
            {text("Comprometidos com o Alto Padrão de Acomodação", "Committed to a High Standard of Accommodation")}
          </h2>
          <p className="text-sm md:text-base text-[#414944] leading-relaxed">
            {language === "pt" ? (about?.history || about?.description || "A Enclave Accommodation nasceu da paixão por transformar estadias em experiências memoráveis. Com sede estratégica em Chimoio e expansão para Mutare e Nyanga, oferecemos mais do que um quarto; entregamos um santuário curado.") : "Enclave Accommodation was born from the passion to turn stays into memorable experiences. From Chimoio to Mutare and Nyanga, we offer more than a room: we deliver a carefully curated sanctuary."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#c0c9c2]/30">
            <div>
              <h4 className="font-display font-bold text-sm text-[#023625] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#7b580b]" />
                <span>{text("Nossa Missão", "Our Mission")}</span>
              </h4>
              <p className="text-xs text-[#414944] mt-1.5 leading-relaxed">
                {language === "pt" ? (about?.mission || "Proporcionar o mais alto padrão de hospitalidade e confiança profissional na região das beiras, garantindo absoluto conforto e tranquilidade para o cliente.") : "To provide a high standard of hospitality and professional trust across the region, ensuring comfort and peace of mind for every guest."}
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[#023625] flex items-center gap-2">
                <Star size={18} className="text-[#7b580b]" />
                <span>{text("Nossos Valores", "Our Values")}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(language === "pt" ? (about?.values || ["Hospitalidade Sob Medida", "Privacidade Absoluta", "Excelência Operacional", "Minimalismo e Elegância"]) : ["Tailored Hospitality", "Absolute Privacy", "Operational Excellence", "Minimalism and Elegance"]).map((val, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-[#023625]/5 text-[#023625] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#023625]/10">
                    <Check size={10} className="text-[#7b580b] shrink-0" />
                    <span>{val}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#023625] p-6 rounded-xl text-[#bceed3] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-3xl md:text-4xl leading-none text-white block">10+</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#bceed3]/80">
                {text("Anos de Experiência", "Years of Experience")}<br />{text("no Sector", "in Hospitality")}
              </span>
            </div>
            <div className="flex-1 pl-0 sm:pl-4 sm:border-l border-[#bceed3]/30">
              <p className="text-xs italic text-[#bceed3]/90 font-medium text-center sm:text-left leading-relaxed">
                "{language === "pt" ? (host?.welcome_message || "A nossa história de sucesso é escrita pelo sorriso e a plena satisfação de cada hóspede que entra na Enclave.") : "Our success story is written through the smile and full satisfaction of every guest who chooses Enclave."}"
              </p>
              <p className="text-xs text-white text-center sm:text-left mt-1.5 font-bold">
                - {host?.name || text("Anfitrião Enclave", "Enclave Host")} ({language === "pt" ? (host?.role || "Fundador e Anfitrião") : "Founder and Host"})
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
