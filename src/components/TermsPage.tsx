import React, { useEffect } from "react";
import { FileText, ArrowLeft, ChevronRight, Check } from "lucide-react";

interface TermsPageProps {
  onClose: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onClose }) => {
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
              <FileText size={24} />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7b580b] bg-[#fdcd78]/20 px-3 py-1 rounded-full">
              Termos & Condições
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-[#023625] tracking-tight leading-tight">
            Termos de Serviço
          </h1>
          <p className="text-sm text-[#414944] mt-3 font-sans max-w-2xl leading-relaxed">
            Ao aceder e utilizar o site do Enclave Accommodation, concorda com as diretrizes e regras aqui especificadas. Por favor, leia atentamente.
          </p>
        </div>

        {/* Core Rich Content (Big, White, Super Spaced & Clean - No Overlapping) */}
        <div className="space-y-12 text-sm text-[#414944] leading-relaxed font-sans">
          
          {/* Section 1: Termos de Acesso */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-[#7b580b]">01.</span>
              <h2 className="font-display font-bold text-xl text-[#023625] tracking-tight">Termos de Aceitação</h2>
            </div>
            <p className="text-base text-[#414944]">
              Ao acessar ao site <span className="font-semibold text-[#023625]">Enclave Accommodation</span>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. 
            </p>
            <p>
              Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
            </p>
          </section>

          {/* Section 2: Uso de Licença */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-[#7b580b]">02.</span>
              <h2 className="font-display font-bold text-xl text-[#023625] tracking-tight">Uso de Licença</h2>
            </div>
            <p>
              É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Enclave Accommodation, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="flex gap-3 bg-[#fcfdfd] border border-gray-100 p-4 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[#023625]/5 text-[#023625] flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Modificar ou copiar os materiais de qualquer secção do site.
                </p>
              </div>

              <div className="flex gap-3 bg-[#fcfdfd] border border-gray-100 p-4 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[#023625]/5 text-[#023625] flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial).
                </p>
              </div>

              <div className="flex gap-3 bg-[#fcfdfd] border border-gray-100 p-4 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[#023625]/5 text-[#023625] flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Tentativa de descompilar ou fazer engenharia reversa de qualquer software contido no site do Enclave Accommodation.
                </p>
              </div>

              <div className="flex gap-3 bg-[#fcfdfd] border border-gray-100 p-4 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[#023625]/5 text-[#023625] flex items-center justify-center shrink-0 text-xs font-bold">4</span>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais textuais ou visuais do site.
                </p>
              </div>

              <div className="flex gap-3 bg-[#fcfdfd] border border-gray-100 p-4 rounded-xl md:col-span-2">
                <span className="w-6 h-6 rounded-full bg-[#023625]/5 text-[#023625] flex items-center justify-center shrink-0 text-xs font-bold">5</span>
                <p className="text-xs text-[#414944] leading-relaxed">
                  Transferir os materiais para outra pessoa ou "espelhar" os materiais em qualquer outro servidor ou domínio externo.
                </p>
              </div>
            </div>

            <p>
              Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Enclave Accommodation a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
            </p>
          </section>

          {/* Section 3: Isenção de Responsabilidade (Styled with clean warning panel style) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-[#7b580b]">03.</span>
              <h2 className="font-display font-bold text-xl text-[#023625] tracking-tight">Isenção de Responsabilidade</h2>
            </div>
            
            <div className="space-y-4 bg-amber-50/40 border border-amber-100 p-6 rounded-xl">
              <div className="flex gap-3 items-start">
                <Check size={16} className="text-[#7b580b] shrink-0 mt-1" />
                <p className="text-xs text-[#5d4615]">
                  Os materiais no site da Enclave Accommodation são fornecidos "como estão". Enclave Accommodation não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outras violações.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <Check size={16} className="text-[#7b580b] shrink-0 mt-1" />
                <p className="text-xs text-[#5d4615]">
                  Além disso, o Enclave Accommodation não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Limitações */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-[#7b580b]">04.</span>
              <h2 className="font-display font-bold text-xl text-[#023625] tracking-tight">Limitações de Responsabilidade</h2>
            </div>
            <p>
              Em nenhum caso o Enclave Accommodation ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Enclave Accommodation, mesmo que o Enclave Accommodation ou um representante autorizado tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
            </p>
            <p className="text-xs text-gray-400">
              Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a si.
            </p>
          </section>

          {/* Section 5: Precisão dos Materiais */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-[#7b580b]">05.</span>
              <h2 className="font-display font-bold text-xl text-[#023625] tracking-tight">Precisão dos Materiais</h2>
            </div>
            <p>
              Os materiais exibidos no site da Enclave Accommodation podem incluir erros técnicos, tipográficos ou fotográficos. O Enclave Accommodation não garante que qualquer material em seu site seja preciso, completo ou atual. Enclave Accommodation pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Enclave Accommodation não se compromete a atualizar os materiais.
            </p>
          </section>

          {/* Section 6: Links */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-[#7b580b]">06.</span>
              <h2 className="font-display font-bold text-xl text-[#023625] tracking-tight">Links Externos</h2>
            </div>
            <p>
              O Enclave Accommodation não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Enclave Accommodation do site. O uso de qualquer site vinculado é por conta e risco do usuário.
            </p>
          </section>

          {/* Modifications & Applicable Law Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="space-y-3">
              <h3 className="font-display font-bold text-[#023625] text-base">Modificações dos Termos</h3>
              <p className="text-xs leading-relaxed text-[#414944]">
                O Enclave Accommodation pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-display font-bold text-[#023625] text-base">Lei Aplicável</h3>
              <p className="text-xs leading-relaxed text-[#414944]">
                Estes termos e condições são regidos e interpretados de acordo com as leis moçambicanas e do Enclave Accommodation e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais locais.
              </p>
            </div>
          </div>

          {/* Footer Date Stamp */}
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
            Aceito os Termos e Condições
          </button>
        </div>
      </div>
    </div>
  );
};
