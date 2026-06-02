import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

interface FormularioReservaProps {
  accommodationName: string;
  accommodationLocation?: string;
  pricePerNight?: number;
  destinationWhatsapp: string;
  language?: "pt" | "en";
  onClear?: () => void;
}

export const FormularioReserva: React.FC<FormularioReservaProps> = ({ 
  accommodationName, 
  accommodationLocation,
  pricePerNight,
  destinationWhatsapp,
  language = "pt",
  onClear
}) => {
  // Estados do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hospedes, setHospedes] = useState("1");
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const text = (pt: string, en: string) => language === "pt" ? pt : en;
  const guestLabel = (value: string) => {
    const labels: Record<string, [string, string]> = {
      "1": ["1 Hóspede", "1 Guest"],
      "2": ["2 Hóspedes", "2 Guests"],
      "3": ["3 Hóspedes", "3 Guests"],
      "4": ["4 Hóspedes", "4 Guests"],
      "5-6": ["5-6 Hóspedes", "5-6 Guests"],
      "7-8": ["7-8 Hóspedes", "7-8 Guests"]
    };
    const [pt, en] = labels[value] || labels["1"];
    return text(pt, en);
  };

  const formatarData = (valor: string) => {
    if (!valor) return "";
    const [ano, mes, dia] = valor.split("-");
    return dia && mes && ano ? `${dia}/${mes}/${ano}` : valor;
  };

  const handleEnviarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErros([]);

    // 1. Validação básica
    const errosValidacao: string[] = [];
    
    if (!nome.trim()) {
      errosValidacao.push(text("Por favor, preencha o seu nome completo.", "Please enter your full name."));
    }
    if (!telefone.trim()) {
      errosValidacao.push(text("Por favor, preencha o seu número de WhatsApp/Telefone.", "Please enter your WhatsApp/phone number."));
    }
    if (!checkIn) {
      errosValidacao.push(text("Por favor, selecione o dia de check-in.", "Please select the check-in date."));
    }
    if (!checkOut) {
      errosValidacao.push(text("Por favor, selecione o dia de check-out.", "Please select the check-out date."));
    }
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      errosValidacao.push(text("A data de check-out deve ser posterior à data de check-in.", "Check-out must be after check-in."));
    }

    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      setEnviando(false);
      return;
    }

    const numeroLimpo = destinationWhatsapp.replace(/\D/g, "");
    if (!numeroLimpo) {
      setErros([text("O número de WhatsApp de destino não está configurado corretamente.", "The destination WhatsApp number is not configured correctly.")]);
      setEnviando(false);
      return;
    }

    const detalhesReserva = [
      `${text("Acomodação", "Accommodation")}: ${accommodationName}`,
      accommodationLocation ? `${text("Destino", "Destination")}: ${accommodationLocation}` : "",
      pricePerNight ? `${text("Preço anunciado", "Listed price")}: ${pricePerNight.toLocaleString("pt-MZ")} MT ${text("por noite", "per night")}` : "",
      "",
      `${text("Nome", "Name")}: ${nome.trim()}`,
      `${text("Telefone", "Phone")}: ${telefone.trim()}`,
      `Check-in: ${formatarData(checkIn)}`,
      `Check-out: ${formatarData(checkOut)}`,
      `${text("Hóspedes", "Guests")}: ${guestLabel(hospedes)}`,
      `${text("Mensagem", "Message")}: ${mensagem.trim() || text("Sem observações adicionais.", "No additional notes.")}`
    ].filter((linha) => linha !== null && linha !== undefined).join("\n");

    // 2. Criação do template de mensagem elegante
    const mensagemFormatada = `${text("Olá!", "Hello!")}

${text("Gostaria de reservar:", "I would like to book:")}
${detalhesReserva}

${text("Aguardo confirmação.", "I await confirmation.")}
${text("Obrigado!", "Thank you!")}`;

    // 3. Criação da URL para API oficial do WhatsApp
    const urlWhatsapp = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagemFormatada)}`;

    setSucesso(true);
    window.open(urlWhatsapp, "_blank", "noopener,noreferrer");
      
    setTimeout(() => {
      setNome("");
      setTelefone("");
      setCheckIn("");
      setCheckOut("");
      setHospedes("1");
      setMensagem("");
      setSucesso(false);
      setEnviando(false);
      
      if (onClear) {
        onClear();
      }
    }, 1200);
  };

  return (
    <form onSubmit={handleEnviarReserva} className="space-y-4">
      {/* Validação Alerts */}
      {erros.length > 0 && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-medium space-y-1">
          {erros.map((err, i) => (
            <p key={i}>• {err}</p>
          ))}
        </div>
      )}

      {sucesso && (
        <div className="bg-[#bceed3] text-[#002114] p-4 rounded-lg text-xs font-semibold text-center border border-[#a1d1b8]">
          {text("✔ Solicitação preparada! Redirecionando para o WhatsApp...", "✔ Request prepared! Redirecting to WhatsApp...")}
        </div>
      )}

      {/* Nome Completo */}
      <div>
        <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">
          {text("Nome Completo", "Full Name")}
        </label>
        <input 
          type="text" 
          required
          placeholder={text("Insira o seu nome", "Enter your name")}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-[#c0c9c2] rounded-lg px-3 py-2 text-sm bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#023625]"
          disabled={enviando}
        />
      </div>

      {/* Telefone / WhatsApp */}
      <div>
        <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">
          {text("Telefone / WhatsApp", "Phone / WhatsApp")}
        </label>
        <input 
          type="tel" 
          required
          placeholder="Ex: +258 84 123 4567"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border border-[#c0c9c2] rounded-lg px-3 py-2 text-sm bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#023625]"
          disabled={enviando}
        />
      </div>

      {/* Check-in e Check-out */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">
            Check-in
          </label>
          <input 
            type="date" 
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-[#c0c9c2] rounded-lg px-2 py-1.5 text-xs bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#023625]"
            disabled={enviando}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">
            Check-out
          </label>
          <input 
            type="date" 
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-[#c0c9c2] rounded-lg px-2 py-1.5 text-xs bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#023625]"
            disabled={enviando}
          />
        </div>
      </div>

      {/* Número de Hóspedes */}
      <div>
        <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">
          {text("Número de Hóspedes", "Number of Guests")}
        </label>
        <select 
          value={hospedes}
          onChange={(e) => setHospedes(e.target.value)}
          className="w-full border border-[#c0c9c2] rounded-lg px-3 py-2 text-xs bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#023625]"
          disabled={enviando}
        >
          {["1", "2", "3", "4", "5-6", "7-8"].map((value) => (
            <option key={value} value={value}>{guestLabel(value)}</option>
          ))}
        </select>
      </div>

      {/* Mensagem Adicional */}
      <div>
        <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">
          {text("Mensagem Adicional (Opcional)", "Additional Message (Optional)")}
        </label>
        <textarea 
          rows={2}
          placeholder={text("Indique pedidos especiais de cama ou horário de chegada...", "Share special bed requests or arrival time...")}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="w-full border border-[#c0c9c2] rounded-lg px-3 py-2 text-xs bg-[#f9f9f9] focus:outline-none focus:ring-1 focus:ring-[#023625]"
          disabled={enviando}
        />
      </div>

      {/* Botão de Reserva */}
      <button 
        type="submit"
        disabled={sucesso || enviando}
        className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-sans font-bold text-sm hover:brightness-95 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
      >
        <MessageSquare size={16} />
        <span>{enviando ? text("A processar...", "Processing...") : text("Reservar pelo WhatsApp", "Book via WhatsApp")}</span>
      </button>

      {/* Rodapé informativo */}
      <div className="mt-4 border-t border-gray-100 pt-3 text-center">
        <p className="text-[10px] text-[#414944] leading-relaxed">
          {text("Sua reserva é validada imediatamente com o nosso agente pelo WhatsApp. Sem custos ocultos nem necessidade de cartões neste canal.", "Your booking request is confirmed directly with our agent via WhatsApp. No hidden costs or card details are required in this channel.")}
        </p>
      </div>
    </form>
  );
};
