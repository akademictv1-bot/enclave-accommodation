import React, { useEffect } from "react";
import { Shield, ArrowLeft, ChevronRight, Check } from "lucide-react";

interface PrivacyPageProps {
  onClose: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onClose }) => {
  // Always scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation Breadcrumb / Go Back */}
        <button 
          onClick={onClose}
          className="group flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#7b580b] hover:text-[#023625] transition-all mb-10 cursor-pointer"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Voltar para o Início</span>
        </button>

        {/* Hero Title Header Area */}
        <div className="border-b border-gray-100 pb-10 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#023625]/5 rounded-xl flex items-center justify-center text-[#7b580b]">
              <Shield size={24} />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7b580b] bg-[#fdcd78]/20 px-3 py-1 rounded-full">
              Legal & Privacidade
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-[#023625] tracking-tight leading-tight">
            Política de Privacidade
          </h1>
          <p className="text-sm text-[#414944] mt-3 font-sans max-w-2xl leading-relaxed">
            A sua privacidade é fundamental para nós. Esta política detalha como o Enclave Accommodation recolhe, protege e processa as suas informações pessoais.
          </p>
        </div>

        {/* Core Rich Content (Big, White, Super Spaced & Clean - No Overlapping) */}
        <div className="space-y-10 text-sm text-[#414944] leading-relaxed font-sans">
          
          {/* Main Statement */}
          <div className="space-y-4">
            <p className="text-base text-[#023625] font-medium">
              A sua privacidade é importante para nós. É política do{" "}
              <span className="font-bold border-b-2 border-[#fdcd78]">Enclave Accommodation</span>{" "}
              respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site{" "}
              <a 
                href="https://enclaveaccommodation.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#023625] underline hover:text-[#7b580b] font-bold"
              >
                enclave accommodation
              </a>
              , e outros sites que possuímos e operamos.
            </p>
            <p>
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
            </p>
            <p>
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>
            <p>
              Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
            </p>
            <p>
              O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas{" "}
              <a 
                href="https://politicaprivacidade.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#023625] underline hover:text-[#7b580b] font-semibold"
              >
                políticas de privacidade
              </a>
              .
            </p>
            <p>
              Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
            </p>
            <p>
              O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.
            </p>
          </div>

          {/* Cookies & Google AdSense Details */}
          <div className="bg-[#fcfdfd] border border-gray-100 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <span className="w-1.5 h-6 bg-[#7b580b] rounded-full" />
              <h3 className="font-display font-bold text-base text-[#023625] tracking-tight">
                Uso de Cookies e Anúncios Regulamentados
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fdcd78]/20 flex items-center justify-center text-[#7b580b] shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#023625] uppercase tracking-wider">Google AdSense Cookie</h4>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fdcd78]/20 flex items-center justify-center text-[#7b580b] shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#023625] uppercase tracking-wider">FAQs e Transparência</h4>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Para mais informações sobre o Google AdSense, consulte as FAQs oficiais sobre privacidade do Google AdSense diretamente nas plataformas deles.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fdcd78]/20 flex items-center justify-center text-[#7b580b] shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#023625] uppercase tracking-wider">Compensação de Custos</h4>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental garantem anúncios de máxima relevância com rastreamento 100% anónimo.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fdcd78]/20 flex items-center justify-center text-[#7b580b] shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#023625] uppercase tracking-wider">Parceiras e Afiliados</h4>
                  <p className="text-xs text-[#414944] leading-relaxed">
                    Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos clientes acederam através deles para que possamos creditar devidamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Commitment Segment */}
          <div className="space-y-5 pt-4">
            <h3 className="font-display font-extrabold text-xl text-[#023625] tracking-tight">
              Compromisso de Uso Adequado pelo Usuário
            </h3>
            <p className="text-sm">
              O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o <strong className="text-[#023625]">Enclave Accommodation</strong> oferece no site e com caráter enunciativo, mas não limitativo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="border border-gray-100 bg-white p-5 rounded-xl shadow-xs space-y-2">
                <div className="w-7 h-7 bg-[#023625] text-white text-xs font-mono font-bold flex items-center justify-center rounded-lg">
                  A
                </div>
                <h4 className="font-bold text-xs text-[#023625] uppercase tracking-wider">Atividades Legais</h4>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública sob qualquer pretexto.
                </p>
              </div>

              <div className="border border-gray-100 bg-white p-5 rounded-xl shadow-xs space-y-2">
                <div className="w-7 h-7 bg-[#023625] text-white text-xs font-mono font-bold flex items-center justify-center rounded-lg">
                  B
                </div>
                <h4 className="font-bold text-xs text-[#023625] uppercase tracking-wider">Conteúdo Íntegro</h4>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de azar, pornografia ilegal, apologia ao terrorismo ou contra os direitos humanos.
                </p>
              </div>

              <div className="border border-gray-100 bg-white p-5 rounded-xl shadow-xs space-y-2">
                <div className="w-7 h-7 bg-[#023625] text-white text-xs font-mono font-bold flex items-center justify-center rounded-lg">
                  C
                </div>
                <h4 className="font-bold text-xs text-[#023625] uppercase tracking-wider">Segurança Digital</h4>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do fornecedor ou de terceiros, nem introduzir vírus informáticos ou malwares.
                </p>
              </div>
            </div>
          </div>

          {/* More details / Cookies closing advice */}
          <div className="border-t border-gray-100 pt-8 space-y-4">
            <h3 className="font-display font-bold text-lg text-[#023625] tracking-tight">
              Mais Informações & Esclarecimentos
            </h3>
            <p>
              Esperamos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
            </p>
          </div>

          {/* Date Stamp */}
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[#414944]">
              Enclave Accommodation &bull; Chimoio, Moçambique
            </span>
            <span className="text-xs font-mono text-gray-400 font-semibold italic">
              Esta política é efetiva a partir de 2 June 2026 07:58
            </span>
          </div>
        </div>

        {/* Footer Actions on Large Page */}
        <div className="mt-16 pt-10 border-t border-gray-100 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-[#023625] hover:bg-[#1f4d3a] text-white text-sm font-bold px-10 py-3.5 rounded-xl transition-all cursor-pointer shadow-md select-none transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Aceitar e Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
};
