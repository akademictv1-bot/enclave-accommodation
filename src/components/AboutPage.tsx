import React from "react";
import { ArrowLeft } from "lucide-react";
import { AboutSectionSettings, HostSettings, ContactsSettings } from "../firebaseClient";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";

interface AboutPageProps {
  about: AboutSectionSettings | null;
  host: HostSettings | null;
  contacts: ContactsSettings | null;
  onClose: () => void;
  language?: "pt" | "en";
}

export function AboutPage({ about, host, contacts, onClose, language = "pt" }: AboutPageProps) {
  const text = (pt: string, en: string) => language === "pt" ? pt : en;

  return (
    <main className="pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <button 
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#023625] hover:text-[#7b580b] mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="transform transition-transform group-hover:-translate-x-1" />
          <span>{text("Voltar para as Acomodações", "Back to Accommodations")}</span>
        </button>
      </div>

      {/* About Section */}
      <AboutSection about={about} host={host} language={language} />

      {/* Contact Section */}
      <ContactSection contacts={contacts} />
    </main>
  );
}
