import React, { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

interface PublicFooterProps {
  onNavigate: (section: string) => void;
  onOpenAdmin?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAbout?: () => void;
  language?: "pt" | "en";
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ 
  onNavigate, 
  onOpenAdmin, 
  onOpenPrivacy, 
  onOpenTerms, 
  onOpenAbout,
  language = "pt"
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const text = (pt: string, en: string) => language === "pt" ? pt : en;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-[#c0c9c2]/30 py-16">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="flex flex-col gap-4">
          <span className="font-display font-bold text-2xl text-[#023625]">Enclave</span>
          <p className="text-sm text-[#414944] leading-relaxed">
            {text("Santuários curados para estadias de alto padrão. Oferecemos as melhores opções de hospedagem com atendimento profissional especializado, refinamento estético e segurança plena.", "Curated sanctuaries for high-standard stays. We offer refined accommodation with specialized service, aesthetic care and dependable security.")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-sm text-[#023625] uppercase tracking-wider">
            {text("Destinos", "Destinations")}
          </h4>
          <nav className="flex flex-col gap-2.5">
            <button 
              onClick={() => onNavigate("acomodacoes")} 
              className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left"
            >
              {text("Chimoio (Moçambique)", "Chimoio (Mozambique)")}
            </button>
            <button 
              onClick={() => onNavigate("acomodacoes")} 
              className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left"
            >
              Mutare (Zimbabwe)
            </button>
            <button 
              onClick={() => onNavigate("acomodacoes")} 
              className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left"
            >
              Nyanga (Zimbabwe)
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-sm text-[#023625] uppercase tracking-wider">
            {text("Empresa", "Company")}
          </h4>
          <nav className="flex flex-col gap-2.5">
            {onOpenAbout ? (
              <>
                <button 
                  onClick={onOpenAbout}
                  className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left cursor-pointer"
                >
                  {text("Sobre Nós", "About Us")}
                </button>
                <button 
                  onClick={onOpenAbout}
                  className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left cursor-pointer"
                >
                  {text("Contactos", "Contacts")}
                </button>
              </>
            ) : (
              <>
                <a href="#" className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left">
                  {text("Sobre Nós", "About Us")}
                </a>
                <a href="#" className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left">
                  {text("Contactos", "Contacts")}
                </a>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <nav className="flex flex-col gap-2.5">
            {onOpenPrivacy ? (
              <button 
                onClick={onOpenPrivacy}
                className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left cursor-pointer"
              >
                {text("Política de Privacidade", "Privacy Policy")}
              </button>
            ) : (
              <a href="#" className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left">
                {text("Política de Privacidade", "Privacy Policy")}
              </a>
            )}
            {onOpenTerms ? (
              <button 
                onClick={onOpenTerms}
                className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left cursor-pointer"
              >
                {text("Termos de Uso", "Terms of Use")}
              </button>
            ) : (
              <a href="#" className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left">
                {text("Termos de Uso", "Terms of Use")}
              </a>
            )}
            <a href="#" className="text-sm text-[#414944] hover:text-[#023625] transition-colors text-left">
              {text("Regras das Casas", "House Rules")}
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-sm text-[#023625] uppercase tracking-wider">
            Newsletter
          </h4>
          <p className="text-xs text-[#414944] mb-1">
            {text("Receba ofertas exclusivas, guias de viagem e novos destinos diretamente no seu email.", "Receive exclusive offers, travel guides and new destinations directly by email.")}
          </p>
          
          {subscribed ? (
            <div className="flex items-center gap-2 text-[#023625] bg-[#bceed3] p-3 rounded-lg text-xs font-semibold">
              <CheckCircle size={14} />
              <span>{text("Inscrito com sucesso! Obrigado.", "Subscribed successfully. Thank you.")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border border-[#c0c9c2] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#023625]">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={text("Seu email", "Your email")} 
                className="bg-transparent border-none text-xs px-3 py-2.5 w-full focus:ring-0 text-on-surface"
              />
              <button 
                type="submit" 
                className="bg-[#023625] text-white px-4 hover:bg-[#1f4d3a] transition-all flex items-center justify-center cursor-pointer"
              >
                <Mail size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#c0c9c2]/30 text-center">
        <p className="text-xs text-[#414944]">
          &copy; {new Date().getFullYear()} Enclave Accommodation. {text("Todos os direitos reservados.", "All rights reserved.")}
        </p>
      </div>
    </footer>
  );
};
