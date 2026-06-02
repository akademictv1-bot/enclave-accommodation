import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, ArrowRight, Check } from "lucide-react";
import { ContactsSettings } from "../firebaseClient";

interface ContactSectionProps {
  contacts: ContactsSettings | null;
}

export function ContactSection({ contacts }: ContactSectionProps) {
  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactIsSubmitting, setContactIsSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<boolean | null>(null);
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactIsSubmitting(true);
    setContactSuccess(null);
    setContactError("");

    const formspreeId = contacts?.formspree_id || "xeedylwp";
    const endpoint = `https://formspree.io/f/${formspreeId}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage
        })
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setContactMessage("");
      } else {
        const data = await response.json();
        setContactError(data.error || "Ocorreu um erro ao enviar a sua mensagem. Por favor, tente novamente mais tarde ou contacte a nossa equipa directamente.");
      }
    } catch (err) {
      setContactError("Ocorreu um erro de rede. Por favor, verifique a sua ligação à internet.");
    } finally {
      setContactIsSubmitting(false);
    }
  };

  return (
    <section id="contactos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#1f4d3a] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl mb-16">
          {/* Contact forms/details info on left */}
          <div className="flex-1 p-8 md:p-12 text-[#bceed3] space-y-6">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white">Estamos prontos para lhe receber</h2>
            <p className="text-sm opacity-90 leading-relaxed max-w-md">
              Seja para reservas individuais, estadias corporativas ou dúvidas de transporte, fale diretamente com a equipe central de suporte.
            </p>

            <ul className="space-y-4 pt-4 border-t border-white/10">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/60 uppercase block font-semibold leading-none">Telefone / WhatsApp</span>
                  <span className="text-white font-semibold text-sm mt-1 block">{contacts?.phone || contacts?.whatsapp_number || "+258 84 000 0000"}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/60 uppercase block font-semibold leading-none">Email Geral</span>
                  <span className="text-white font-semibold text-sm mt-1 block">{contacts?.email || "reservas@enclave.co.mz"}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/60 uppercase block font-semibold leading-none">Região Central de Escritório</span>
                  <span className="text-white font-semibold text-sm mt-1 block">{contacts?.address || "Avenida 25 de Setembro, Chimoio, Moçambique"}</span>
                </div>
              </li>
            </ul>

            <a 
              href={`https://wa.me/${(contacts?.whatsapp_number || "+26377735000").replace(/[^\w+]/g, "")}?text=Olá.%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20as%20estadias%20Enclave.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#7b580b] text-white px-6 py-3 rounded-lg font-sans font-semibold text-xs hover:bg-[#7b580b]/90 transition-all flex items-center gap-2 cursor-pointer mt-4"
            >
              <MessageSquare size={14} />
              <span>Iniciar Conversação no WhatsApp</span>
            </a>
          </div>

          {/* Modern Formspree Contact Form on right */}
          <div className="flex-1 bg-white p-8 md:p-12 text-[#023625] flex flex-col justify-center">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7b580b] mb-1.5 block">Envie uma Mensagem</span>
            <h3 className="font-display font-black text-xl md:text-2xl text-[#023625] mb-6 leading-tight">Formulário de Contacto</h3>
            
            {contactSuccess ? (
              <div className="bg-[#bceed3]/35 border border-[#bceed3] rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 bg-[#bceed3] text-[#023625] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check size={20} className="stroke-[3]" />
                </div>
                <h4 className="font-display font-extrabold text-[#023625] text-sm uppercase tracking-wide">Mensagem Enviada!</h4>
                <p className="text-xs text-[#414944] leading-relaxed max-w-sm mx-auto">
                  Agradecemos o seu contacto. A nossa equipa central responderá diretamente para o seu correio eletrónico com a máxima prontidão.
                </p>
                <button 
                  onClick={() => setContactSuccess(null)}
                  className="text-xs font-bold text-[#7b580b] hover:text-[#023625] transition-colors cursor-pointer pt-2 select-none"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 font-sans">
                {contactError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg leading-relaxed">
                    {contactError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#023625] uppercase tracking-wider mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: António Silva"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-[#023625] bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#023625] focus:border-[#023625] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#023625] uppercase tracking-wider mb-1">Correio Eletrónico (Email)</label>
                    <input 
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Ex: email@exemplo.com"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-[#023625] bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#023625] focus:border-[#023625] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#023625] uppercase tracking-wider mb-1">Telefone / WhatsApp</label>
                    <input 
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Ex: +258 84 123 4567"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-[#023625] bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#023625] focus:border-[#023625] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#023625] uppercase tracking-wider mb-1">Mensagem ou Dúvida</label>
                  <textarea 
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Escreva como podemos ajudar ou descreva as datas que pretende reservar..."
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-[#023625] bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#023625] focus:border-[#023625] transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={contactIsSubmitting}
                  className="w-full bg-[#023625] text-white hover:bg-[#1f4d3a] font-bold py-3.5 px-4 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {contactIsSubmitting ? "A enviar..." : "Enviar Mensagem por E-mail"}
                  <ArrowRight size={14} />
                </button>
                
                <p className="text-[9px] text-[#414944]/65 text-center uppercase tracking-wider font-mono">
                  Resposta com a máxima brevidade
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Dynamic Map Coordinates Integration Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7b580b] bg-[#fdcd78]/20 px-3 py-1 rounded-full">
              Presença Internacional
            </span>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#023625]">
              Presença Regional Transfronteiriça
            </h3>
            <p className="text-xs md:text-sm text-[#414944] leading-relaxed">
              Operamos com excelência e conforto no corredor de Beira, assegurando estadias inigualáveis tanto em território moçambicano como no Zimbabwe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mozambique Map Card */}
            <div className="bg-[#fcfdfd] border border-gray-100 rounded-2xl overflow-hidden p-5 space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-label="Moçambique">🇲🇿</span>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[#023625] uppercase tracking-wide">
                      Enclave Moçambique
                    </h4>
                    <p className="text-[10px] font-mono font-semibold text-gray-400">
                      Sede Administrativa Central
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
                  <span className="font-bold text-[#023625] block">Endereço Oficial:</span>
                  <span className="text-[#414944]/90 block">{contacts?.address || "Avenida da Independência, Chimoio, Moçambique"}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${contacts?.latitude_mz || "-19.1164"},${contacts?.longitude_mz || "33.4833"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#023625]/5 hover:bg-[#023625] hover:text-white text-[#023625] font-bold px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest text-center transition-all shrink-0"
                >
                  Rotas no Maps
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
                      Expansão Regional e Turismo
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
                  <span className="font-bold text-[#023625] block">Endereço Oficial:</span>
                  <span className="text-[#414944]/90 block">{contacts?.address_zw || "Fife Street, Harare, Zimbabwe"}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${contacts?.latitude_zw || "-18.9701"},${contacts?.longitude_zw || "32.6685"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#023625]/5 hover:bg-[#023625] hover:text-white text-[#023625] font-bold px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest text-center transition-all shrink-0"
                >
                  Rotas no Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
