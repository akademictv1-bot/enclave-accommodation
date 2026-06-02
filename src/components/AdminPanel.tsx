import React, { useState, useEffect } from "react";
import { 
  Building, Settings, User, Plus, Trash2, Edit2, LogOut, Check, X, 
  AlertTriangle, Image as ImageIcon, Sparkles, MapPin, ExternalLink,
  Home, Info, PhoneCall, Upload, Cloud, Wifi, AlertCircle
} from "lucide-react";
import { Accommodation, AccommodationImage, Amenity } from "../types";
import { 
  dbService, 
  auth, 
  checkFirestoreConnection,
  isFirestoreConnected,
  syncLocalToFirestore,
  HomepageSettings, 
  AboutSectionSettings, 
  HostSettings, 
  ContactsSettings 
} from "../firebaseClient";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";

interface AdminPanelProps {
  onClose: () => void;
}

type AdminTab = "accommodations" | "homepage" | "about" | "host" | "contacts";

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  // Authentication states
  const [email, setEmail] = useState("akademictv1@gmail.com");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // DB Sync States
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [allImages, setAllImages] = useState<AccommodationImage[]>([]);
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  
  // Custom Dynamic Content States
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [aboutSettings, setAboutSettings] = useState<AboutSectionSettings | null>(null);
  const [hostSettings, setHostSettings] = useState<HostSettings | null>(null);
  const [contactsSettings, setContactsSettings] = useState<ContactsSettings | null>(null);

  // Selected Tab & Items
  const [activeTab, setActiveTab] = useState<AdminTab>("accommodations");
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null);

  // Form States - Acc
  const [isEditingAcc, setIsEditingAcc] = useState(false);
  const [editingAcc, setEditingAcc] = useState<Partial<Accommodation>>({});
  
  // Aux state info
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newAmenityName, setNewAmenityName] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [savingAction, setSavingAction] = useState<string | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);
  const [cloudConnected, setCloudConnected] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkFirestoreConnection().then(setCloudConnected);
  }, [isAuthenticated]);

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    try {
      await syncLocalToFirestore();
      showFeedback("Todos os dados sincronizados com a nuvem!");
      await checkFirestoreConnection().then(setCloudConnected);
    } catch (err) {
      alert("Erro ao sincronizar com a nuvem. Verifique a sua ligação.");
    } finally {
      setIsSyncing(false);
    }
  };

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const loadData = async () => {
    // 1. Accommodations
    try {
      const accList = await dbService.getAccommodations();
      setAccommodations(accList);
      if (accList.length > 0 && !selectedAccId) {
        setSelectedAccId(accList[0].id);
      }
    } catch (err) {
      console.warn("Utilizando acomodações padrão no painel de admin:", err);
      try {
        const { initialAccommodations } = await import("../initialData");
        setAccommodations(initialAccommodations);
        if (initialAccommodations.length > 0 && !selectedAccId) {
          setSelectedAccId(initialAccommodations[0].id);
        }
      } catch (innerErr) {
        // Silently catch static fallback import error
      }
    }
    
    // 2. Images
    try {
      const imgs = await dbService.getImages();
      setAllImages(imgs);
    } catch (err) {
      console.warn("Utilizando imagens padrão no painel de admin:", err);
      try {
        const { initialImages } = await import("../initialData");
        setAllImages(initialImages);
      } catch (innerErr) {}
    }

    // 3. Amenities
    try {
      const ams = await dbService.getAmenities();
      setAllAmenities(ams);
    } catch (err) {
      console.warn("Utilizando comodidades padrão no painel de admin:", err);
      try {
        const { initialAmenities } = await import("../initialData");
        setAllAmenities(initialAmenities);
      } catch (innerErr) {}
    }

    // 4. Homepage Settings
    try {
      const home = await dbService.getHomepage();
      setHomepageSettings(home);
    } catch (err) {
      console.warn("Utilizando homepage padrão no painel de admin:", err);
      try {
        const { defaultHomepage } = await import("../firebaseClient");
        setHomepageSettings(defaultHomepage);
      } catch (innerErr) {}
    }

    // 5. About Settings
    try {
      const abt = await dbService.getAbout();
      setAboutSettings(abt);
    } catch (err) {
      console.warn("Utilizando sobre-nós padrão no painel de admin:", err);
      try {
        const { defaultAbout } = await import("../firebaseClient");
        setAboutSettings(defaultAbout);
      } catch (innerErr) {}
    }

    // 6. Host Details
    try {
      const hst = await dbService.getHost();
      setHostSettings(hst);
    } catch (err) {
      console.warn("Utilizando anfitrião padrão no painel de admin:", err);
      try {
        const { defaultHost } = await import("../firebaseClient");
        setHostSettings(defaultHost);
      } catch (innerErr) {}
    }

    // 7. Contacts Details
    try {
      const cnt = await dbService.getContacts();
      setContactsSettings(cnt);
    } catch (err) {
      console.warn("Utilizando contactos padrão no painel de admin:", err);
      try {
        const { defaultContacts } = await import("../firebaseClient");
        setContactsSettings(defaultContacts);
      } catch (innerErr) {}
    }
  };

  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    if (window.confirm("Deseja estruturar o servidor de dados com todos os conteúdos predefinidos iniciais? Este processo configurará o sistema de forma transparente e automática.")) {
      setIsSeeding(true);
      const result = await dbService.seedDatabase();
      if (result.failed > 0 && result.success === 0) {
        alert("Erro ao estruturar o servidor de dados. Verifique a ligação ao Firestore no console do navegador (F12).");
      } else if (result.failed > 0) {
        showFeedback(`${result.success} itens sincronizados, ${result.failed} falhas (parcial).`);
      } else {
        showFeedback("Servidor de dados sincronizado e estruturado com sucesso!");
      }
      await checkFirestoreConnection().then(setCloudConnected);
      await loadData();
      setIsSeeding(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      setAuthError("Credenciais inválidas ou erro ao ligar ao servidor de segurança.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  // ACCOMODATIONS CONTROLS
  const handleSaveAccommodation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAcc.name || !editingAcc.city || !editingAcc.country || !editingAcc.price_per_night) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const payload: Omit<Accommodation, "id"> & { id?: string } = {
      id: editingAcc.id,
      name: editingAcc.name,
      city: editingAcc.city,
      country: editingAcc.country,
      description: editingAcc.description || "",
      price_per_night: Number(editingAcc.price_per_night),
      bedrooms: Number(editingAcc.bedrooms || 1),
      beds: Number(editingAcc.beds || 1),
      bathrooms: Number(editingAcc.bathrooms || 1),
      max_guests: Number(editingAcc.max_guests || 1),
      google_maps_link: editingAcc.google_maps_link || "https://maps.google.com",
      whatsapp_number: editingAcc.whatsapp_number || (contactsSettings?.whatsapp_number || "+26377735000")
    };

    setSavingAction("acc");
    try {
      const saved = await dbService.saveAccommodation(payload);
      await loadData();
      setSelectedAccId(saved.id);
      setSuccessAction("acc");
      setTimeout(() => {
        setIsEditingAcc(false);
        setEditingAcc({});
        setSuccessAction(null);
      }, 1500);
      showFeedback("Acomodação salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar acomodação.");
    } finally {
      setSavingAction(null);
    }
  };

  const handleDeleteAccommodation = async (id: string) => {
    if (window.confirm("Pretende realmente excluir esta acomodação? Isso removerá as fotos e comodidades ligadas a ela.")) {
      try {
        await dbService.deleteAccommodation(id);
        if (selectedAccId === id) {
          setSelectedAccId(null);
        }
        await loadData();
        showFeedback("Acomodação excluída.");
      } catch (err) {
        alert("Erro ao excluir acomodação.");
      }
    }
  };

  const startEditAccommodation = (acc: Accommodation) => {
    setEditingAcc(acc);
    setIsEditingAcc(true);
  };

  const startCreateAccommodation = () => {
    setEditingAcc({
      city: "Chimoio",
      country: "Moçambique",
      price_per_night: 5000,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      max_guests: 4,
    });
    setIsEditingAcc(true);
  };

  // PHOTO CONTROLS
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccId || !newPhotoUrl.trim()) return;
    setSavingAction("photo");
    try {
      await dbService.addImage(selectedAccId, newPhotoUrl.trim());
      setNewPhotoUrl("");
      await loadData();
      showFeedback("Foto adicionada à galeria!");
      setSuccessAction("photo");
      setTimeout(() => setSuccessAction(null), 2500);
    } catch (err) {
      alert("Erro ao adicionar foto.");
    } finally {
      setSavingAction(null);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await dbService.deleteImage(id);
      await loadData();
      showFeedback("Foto removida.");
    } catch (err) {
      alert("Erro ao remover foto.");
    }
  };

  // AMENITIES CONTROLS
  const handleAddAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccId || !newAmenityName.trim()) return;
    setSavingAction("amenity");
    try {
      await dbService.addAmenity(selectedAccId, newAmenityName.trim());
      setNewAmenityName("");
      await loadData();
      showFeedback("Comodidade cadastrada!");
      setSuccessAction("amenity");
      setTimeout(() => setSuccessAction(null), 2500);
    } catch (err) {
      alert("Erro ao cadastrar comodidade.");
    } finally {
      setSavingAction(null);
    }
  };

  const handleDeleteAmenity = async (id: string) => {
    try {
      await dbService.deleteAmenity(id);
      await loadData();
      showFeedback("Comodidade removida.");
    } catch (err) {
      alert("Erro ao remover comodidade.");
    }
  };

  // HOMEPAGE COMPONENT FORM
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepageSettings) return;
    setSavingAction("homepage");
    try {
      await dbService.saveHomepage(homepageSettings);
      showFeedback("Cabeçalho e Banner Inicial atualizados!");
      setSuccessAction("homepage");
      setTimeout(() => setSuccessAction(null), 3000);
    } catch (err) {
      alert("Erro ao salvar configuração do Banner.");
    } finally {
      setSavingAction(null);
    }
  };

  // ABOUT COMPONENT FORM
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutSettings) return;
    setSavingAction("about");
    try {
      await dbService.saveAbout(aboutSettings);
      showFeedback("Secção Sobre Nós gravada com sucesso!");
      setSuccessAction("about");
      setTimeout(() => setSuccessAction(null), 3000);
    } catch (err) {
      alert("Erro ao salvar dados institucionais.");
    } finally {
      setSavingAction(null);
    }
  };

  // HOST ACTIONS
  const handleSaveHostInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostSettings) return;
    setSavingAction("host");
    try {
      await dbService.saveHost(hostSettings);
      showFeedback("Perfil do Anfitrião atualizado!");
      setSuccessAction("host");
      setTimeout(() => setSuccessAction(null), 3000);
    } catch (err) {
      alert("Erro ao salvar dados do anfitrião.");
    } finally {
      setSavingAction(null);
    }
  };

  // CONTACTS ACTIONS
  const handleSaveContactsInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactsSettings) return;
    setSavingAction("contacts");
    try {
      await dbService.saveContacts(contactsSettings);
      showFeedback("Informações centrais de contacto registradas!");
      setSuccessAction("contacts");
      setTimeout(() => setSuccessAction(null), 3000);
    } catch (err) {
      alert("Erro ao salvar dados de contacto.");
    } finally {
      setSavingAction(null);
    }
  };

  const currentAcc = accommodations.find(a => a.id === selectedAccId);
  const currentAccImages = allImages.filter(img => img.accommodation_id === selectedAccId);
  const currentAccAmenities = allAmenities.filter(am => am.accommodation_id === selectedAccId);

  // Authentication Guard Visual Design
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#023625] flex items-center justify-center p-6 backdrop-blur-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#c0c9c2]/30 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#023625] text-[#bceed3] rounded-full flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          <h2 className="font-display font-bold text-2xl text-[#023625] tracking-tight text-center">
            Acesso à Enclave
          </h2>
          <p className="font-sans text-xs text-[#414944] text-center mt-2 max-w-xs leading-relaxed">
            Painel administrativo restrito para gestão de reservas, acomodações em Moçambique e Zimbabwe e informações institucionais.
          </p>

          <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">
                Correio Eletrónico (Email)
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#c0c9c2] px-4 py-3 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#023625]"
                placeholder="Exemplo: administrador@enclave.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">
                Palavra-passe (Senha)
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#c0c9c2] px-4 py-3 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#023625]"
                placeholder="Insira a sua código exclusivo"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="w-1/2 border border-[#c0c9c2] py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 text-[#414944] cursor-pointer"
              >
                Voltar ao Site
              </button>
              <button 
                type="submit" 
                disabled={authLoading}
                className="w-1/2 bg-[#023625] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1f4d3a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {authLoading ? "Autenticando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-[#c0c9c2]/30 pt-4 w-full text-center">
            <span className="text-[10px] text-gray-400">Enclave Administration Securised Matrix</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f9f9f9] overflow-y-auto flex flex-col">
      {/* Feedback banner */}
      {actionFeedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#023625] text-white px-6 py-3 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 z-50 animate-bounce duration-500 border border-[#a1d1b8]/40">
          <Sparkles size={14} className="text-[#fdcd78]" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Admin header */}
      <header className="bg-[#023625] text-white h-20 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Building className="text-[#a1d1b8]" />
          <div>
            <span className="font-display font-bold text-lg leading-none block">Painel de Gestão Central</span>
            <span className="text-xs text-[#a1d1b8] tracking-wider uppercase font-semibold">Enclave Accommodation</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase" title={cloudConnected === null ? "A verificar..." : cloudConnected ? "Base de dados online" : "Apenas local — sem ligação à nuvem"}>
            {cloudConnected === null ? (
              <><div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div><span className="hidden md:inline text-yellow-300">A verificar...</span></>
            ) : cloudConnected ? (
              <><Wifi size={14} className="text-green-400" /><span className="hidden md:inline text-green-300">Online</span></>
            ) : (
              <><AlertCircle size={14} className="text-orange-400" /><span className="hidden md:inline text-orange-300">Local</span></>
            )}
          </span>

          {cloudConnected && (
            <button
              onClick={handleSyncToCloud}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Força a sincronização de todos os dados locais para a nuvem"
            >
              <Cloud size={14} />
              <span className="hidden md:inline">{isSyncing ? "A sincronizar..." : "Sync"}</span>
            </button>
          )}

          <button 
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="flex items-center gap-2 bg-[#fdcd78] hover:bg-[#e3b25f] text-[#023625] px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Sincroniza todos os dados padrão do site com o servidor central, repondo as configurações iniciais"
          >
            <Sparkles size={16} />
            <span className="hidden md:inline">{isSeeding ? "Semeando..." : "Sincronizar Dados Iniciais"}</span>
          </button>
          <button 
            onClick={handleLogOut}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Sair do Canal</span>
          </button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("accommodations")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${activeTab === "accommodations" ? "bg-[#023625] text-white shadow-md" : "hover:bg-[#c0c9c2]/20 text-[#414944]"}`}
          >
            <Building size={18} />
            <span>Acomodações</span>
          </button>
          <button 
            onClick={() => setActiveTab("homepage")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${activeTab === "homepage" ? "bg-[#023625] text-white shadow-md" : "hover:bg-[#c0c9c2]/20 text-[#414944]"}`}
          >
            <Home size={18} />
            <span>Página Inicial & Carousel</span>
          </button>
          <button 
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${activeTab === "about" ? "bg-[#023625] text-white shadow-md" : "hover:bg-[#c0c9c2]/20 text-[#414944]"}`}
          >
            <Info size={18} />
            <span>Sobre Nós e Valores</span>
          </button>
          <button 
            onClick={() => setActiveTab("host")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${activeTab === "host" ? "bg-[#023625] text-white shadow-md" : "hover:bg-[#c0c9c2]/20 text-[#414944]"}`}
          >
            <User size={18} />
            <span>Anfitrião (Host)</span>
          </button>
          <button 
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${activeTab === "contacts" ? "bg-[#023625] text-white shadow-md" : "hover:bg-[#c0c9c2]/20 text-[#414944]"}`}
          >
            <PhoneCall size={18} />
            <span>Contactos e Redes Sociais</span>
          </button>
        </aside>

        {/* Workspace Display Area */}
        <main className="flex-1 bg-white rounded-2xl shadow-md border border-[#c0c9c2]/30 p-6 overflow-hidden">
          
          {/* TAB 1: ACCOMMODATIONS */}
          {activeTab === "accommodations" && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center border-b border-[#c0c9c2]/30 pb-4 mb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#023625]">Gerenciar Imóveis</h2>
                  <p className="text-xs text-[#414944] mt-0.5">Gestão de comodidades, fotos e dados estáticos das vilas Enclave.</p>
                </div>
                <button 
                  onClick={startCreateAccommodation}
                  className="bg-[#023625] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#1f4d3a] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Cadastrar Acomodação</span>
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-2">
                {/* Accommodations List Index */}
                <div className="lg:col-span-5 border-r border-[#c0c9c2]/20 pr-4 space-y-3 max-h-[500px] overflow-y-auto">
                  {accommodations.length === 0 ? (
                    <p className="text-sm text-gray-400 py-10 text-center italic">Nenhum imóvel ativo cadastrado.</p>
                  ) : (
                    accommodations.map((acc) => {
                      const firstImg = allImages.find(i => i.accommodation_id === acc.id)?.image_url;
                      return (
                        <div 
                          key={acc.id}
                          onClick={() => setSelectedAccId(acc.id)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${selectedAccId === acc.id ? "border-[#023625] bg-[#bceed3]/20" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <div className="w-16 h-12 rounded overflow-hidden shrink-0 bg-gray-100">
                            {firstImg ? (
                              <img src={firstImg} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={16} /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-[#7b580b] uppercase block tracking-wider leading-none">{acc.city}</span>
                            <span className="font-semibold text-sm text-[#023625] truncate block mt-1">{acc.name}</span>
                            <span className="text-xs text-[#414944]">{acc.price_per_night.toLocaleString("pt-MZ")} MT/noite</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); startEditAccommodation(acc); }}
                              className="p-1 text-gray-500 hover:text-[#023625] transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteAccommodation(acc.id); }}
                              className="p-1 text-gray-500 hover:text-red-700 transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Selected Item Detail */}
                <div className="lg:col-span-7 space-y-5">
                  {currentAcc ? (
                    <div className="space-y-4">
                      {/* Accommodation Preview */}
                      <div className="bg-[#f3f3f3] p-4 rounded-xl flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-[#7b580b] font-semibold uppercase tracking-wider">
                            <MapPin size={12} />
                            <span>{currentAcc.city}, {currentAcc.country}</span>
                          </div>
                          <h3 className="font-display font-bold text-lg text-[#023625] mt-1">{currentAcc.name}</h3>
                          <p className="text-xs text-[#414944] mt-1">Preço unitário: <strong className="text-[#023625]">{currentAcc.price_per_night.toLocaleString("pt-MZ")} MT</strong> por noite</p>
                          <p className="text-xs text-[#414944]">WhatsApp canal direto: <strong>{currentAcc.whatsapp_number}</strong></p>
                        </div>
                        <button 
                          onClick={() => startEditAccommodation(currentAcc)}
                          className="flex items-center gap-1 border border-[#023625] text-[#023625] px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#023625] hover:text-white transition-all cursor-pointer"
                        >
                          <Edit2 size={12} />
                          <span>Editar</span>
                        </button>
                      </div>

                      {/* Photo Manager */}
                      <div className="border-t border-[#c0c9c2]/30 pt-4">
                        <label className="text-sm font-semibold text-[#023625] block mb-2">Fotos Auxiliares ({currentAccImages.length})</label>
                        
                        <div className="space-y-3 mb-4">
                          {/* Option A: By URL */}
                          <form onSubmit={handleAddPhoto} className="flex gap-2">
                            <input 
                              type="text"
                              required
                              placeholder="Anexar por link direto (ex: https://site.com/foto.jpg)"
                              value={newPhotoUrl}
                              onChange={(e) => setNewPhotoUrl(e.target.value)}
                              className="flex-1 border border-[#c0c9c2] px-3 py-2 rounded-lg text-xs"
                            />
                            <button 
                              type="submit"
                              disabled={savingAction === "photo"}
                              className={`px-4 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-1 ${
                                successAction === "photo" 
                                  ? "bg-[#25D366] text-white font-bold" 
                                  : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                              }`}
                            >
                              {savingAction === "photo" ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Anexando...</span>
                                </>
                              ) : successAction === "photo" ? (
                                <>
                                  <Check size={12} className="stroke-[3]" />
                                  <span>Foto Anexada!</span>
                                </>
                              ) : (
                                <span>Anexar por URL</span>
                              )}
                            </button>
                          </form>

                          {/* Option B: By File Upload */}
                          <div className="flex items-center justify-between border border-dashed border-[#c0c9c2] p-3 rounded-lg bg-gray-50">
                            <div>
                              <p className="text-xs font-semibold text-[#023625]">Carregar Foto Real do Computador</p>
                              <p className="text-[10px] text-[#414944] mt-0.5">Selecione uma imagem do seu dispositivo para guardar de forma imediata.</p>
                            </div>
                            <label className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1 ${
                              successAction === "file_photo"
                                ? "bg-[#25D366] text-white"
                                : savingAction === "file_photo"
                                  ? "bg-gray-300 text-gray-700 pointer-events-none"
                                  : "bg-[#fdcd78] hover:bg-[#e3b25f] text-[#023625]"
                            }`}>
                              {savingAction === "file_photo" ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-[#023625] border-t-transparent rounded-full animate-spin"></div>
                                  <span>Carregando...</span>
                                </>
                              ) : successAction === "file_photo" ? (
                                <>
                                  <Check size={14} className="stroke-[3]" />
                                  <span>✓ Foto Enviada!</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  <span>Escolher Ficheiro</span>
                                </>
                              )}
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  
                                  // Limit photo sizes to prevent Firestore document limit issues (e.g. max 1MB for base64)
                                  if (file.size > 2 * 1024 * 1024) {
                                    alert("A foto escolhida é muito grande. Por favor escolha uma imagem de até 2MB.");
                                    return;
                                  }

                                  setSavingAction("file_photo");
                                  const reader = new FileReader();
                                  reader.onload = async (event) => {
                                    const base64 = event.target?.result as string;
                                    if (base64) {
                                      try {
                                        await dbService.addImage(selectedAccId, base64);
                                        await loadData();
                                        showFeedback("Foto real carregada e gravada com sucesso!");
                                        setSuccessAction("file_photo");
                                        setTimeout(() => setSuccessAction(null), 2500);
                                      } catch (err) {
                                        alert("Erro ao gravar arquivo de foto no servidor.");
                                      } finally {
                                        setSavingAction(null);
                                      }
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto">
                          {currentAccImages.map((img) => (
                            <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group border">
                              <img src={img.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button 
                                type="button"
                                onClick={() => handleDeletePhoto(img.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:scale-105 cursor-pointer flex items-center justify-center h-5 w-5"
                                title="Remover"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities Manager */}
                      <div className="border-t border-[#c0c9c2]/30 pt-4">
                        <label className="text-sm font-semibold text-[#023625] block mb-2">Comodidades ({currentAccAmenities.length})</label>
                        <form onSubmit={handleAddAmenity} className="flex gap-2 mb-3">
                          <input 
                            type="text"
                            required
                            list="amenity_presets"
                            placeholder="Adicionar recurso (ex: Wi-Fi ultra-rápido, Climatizado)"
                            value={newAmenityName}
                            onChange={(e) => setNewAmenityName(e.target.value)}
                            className="flex-1 border border-[#c0c9c2] px-3 py-2 rounded-lg text-xs"
                          />
                          <datalist id="amenity_presets">
                            <option value="Wi-Fi ultra-rápido" />
                            <option value="Estacionamento Grátis" />
                            <option value="Cozinha Equipada" />
                            <option value="Água Quente" />
                            <option value="Netflix & Smart TV" />
                            <option value="Quintal Privado" />
                            <option value="Climatizado" />
                            <option value="Segurança 24h" />
                          </datalist>
                          <button 
                            type="submit"
                            disabled={savingAction === "amenity"}
                            className={`px-4 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
                              successAction === "amenity" 
                                ? "bg-[#25D366] text-white font-bold" 
                                : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                            }`}
                          >
                            {savingAction === "amenity" ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Adicionando...</span>
                              </>
                            ) : successAction === "amenity" ? (
                              <>
                                <Check size={12} className="stroke-[3]" />
                                <span>Adicionado!</span>
                              </>
                            ) : (
                              <span>Adicionar</span>
                            )}
                          </button>
                        </form>

                        <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                          {currentAccAmenities.map((am) => (
                            <span 
                              key={am.id}
                              className="inline-flex items-center gap-1 bg-[#bceed3]/30 text-[#023625] px-2.5 py-1 rounded-full text-xs border border-[#bceed3]"
                            >
                              <span>{am.amenity_name}</span>
                              <button 
                                type="button"
                                onClick={() => handleDeleteAmenity(am.id)}
                                className="text-red-700 hover:text-red-900 font-bold ml-1 cursor-pointer"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-gray-400">
                      <Building size={32} className="mx-auto" />
                      <p className="text-xs mt-2">Selecione uma acomodação para gerenciar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE */}
          {activeTab === "homepage" && homepageSettings && (
            <div className="space-y-4 overflow-y-auto h-full pr-1">
              <div className="border-b border-[#c0c9c2]/30 pb-3">
                <h2 className="font-display font-bold text-xl text-[#023625]">Configurar Banner e Cabeçalho Inicial</h2>
                <p className="text-xs text-[#414944] mt-0.5">Torne o título principal, subtítulos e imagens de carrossel do banner 100% dinâmicos.</p>
              </div>

              <form onSubmit={handleSaveHomepage} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Badge Superior</label>
                  <input 
                    type="text"
                    required
                    value={homepageSettings.hero_badge}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, hero_badge: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Título do Banner (Grande)</label>
                  <textarea 
                    rows={2}
                    required
                    value={homepageSettings.hero_title}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, hero_title: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Subtítulo do Banner (Médio)</label>
                  <textarea 
                    rows={3}
                    required
                    value={homepageSettings.hero_subtitle}
                    onChange={(e) => setHomepageSettings({ ...homepageSettings, hero_subtitle: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Imagens Carrossel do Banner (Uma URL de imagem por linha)</label>
                  
                  <div className="space-y-2">
                    <textarea 
                      rows={5}
                      required
                      value={homepageSettings.carousel_images.join("\n")}
                      onChange={(e) => setHomepageSettings({ 
                        ...homepageSettings, 
                        carousel_images: e.target.value.split("\n").map(line => line.trim()).filter(line => line.length > 0)
                      })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-xs font-mono"
                      placeholder="Cole os links das imagens aqui, uma por linha"
                    />

                    <div className="flex items-center justify-between border border-dashed border-[#c0c9c2] p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-xs font-semibold text-[#023625]">Carregar Nova Foto para o Banner Principal</p>
                        <p className="text-[10px] text-[#414944] mt-0.5">Selecione uma imagem real para adicionar ao carrossel rotativo.</p>
                      </div>
                      <label className="bg-[#fdcd78] hover:bg-[#e3b25f] text-[#023625] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1">
                        <Upload size={14} />
                        <span>Anexar Foto</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            if (file.size > 2 * 1024 * 1024) {
                              alert("Muito grande. O limite máximo para base64 do carrossel é de 2MB.");
                              return;
                            }

                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              if (base64) {
                                setHomepageSettings({ 
                                  ...homepageSettings, 
                                  carousel_images: [...homepageSettings.carousel_images, base64] 
                                });
                                showFeedback("Foto real adicionada ao fim da lista! Lembre-se de clicar em salvar no fim.");
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h3 className="font-semibold text-[#023625] text-sm mb-2">Realce Promocional (Rodapé do Banner)</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Título do Destaque</label>
                      <input 
                        type="text"
                        required
                        value={homepageSettings.promo_title || ""}
                        onChange={(e) => setHomepageSettings({ ...homepageSettings, promo_title: e.target.value })}
                        className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Texto de Realce</label>
                      <textarea 
                        rows={2}
                        required
                        value={homepageSettings.promo_text || ""}
                        onChange={(e) => setHomepageSettings({ ...homepageSettings, promo_text: e.target.value })}
                        className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={savingAction === "homepage"}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all flex items-center gap-2 ${
                    successAction === "homepage" 
                      ? "bg-[#25D366] text-white" 
                      : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                  }`}
                >
                  {savingAction === "homepage" ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Gravando alterações...</span>
                    </>
                  ) : successAction === "homepage" ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>✓ Cabeçalho Gravado com Sucesso!</span>
                    </>
                  ) : (
                    <span>Salvar Textos do Banner</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ABOUT US */}
          {activeTab === "about" && aboutSettings && (
            <div className="space-y-4 overflow-y-auto h-full pr-1">
              <div className="border-b border-[#c0c9c2]/30 pb-3">
                <h2 className="font-display font-bold text-xl text-[#023625]">Configurar Secção "Sobre Nós"</h2>
                <p className="text-xs text-[#414944] mt-0.5">Altere totalmente a biografia da empresa, missão, visão e valores institucionais.</p>
              </div>

              <form onSubmit={handleSaveAbout} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Título de Cabeçalho</label>
                  <input 
                    type="text"
                    required
                    value={aboutSettings.title}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, title: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">História / Biografia da Empresa</label>
                  <textarea 
                    rows={4}
                    required
                    value={aboutSettings.history}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, history: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Nossa Missão</label>
                    <textarea 
                      rows={4}
                      required
                      value={aboutSettings.mission}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, mission: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Nossa Visão</label>
                    <textarea 
                      rows={4}
                      required
                      value={aboutSettings.vision}
                      onChange={(e) => setAboutSettings({ ...aboutSettings, vision: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Valores Empresariais (Separados por vírgula)</label>
                  <input 
                    type="text"
                    required
                    value={aboutSettings.values.join(", ")}
                    onChange={(e) => setAboutSettings({ 
                      ...aboutSettings, 
                      values: e.target.value.split(",").map(v => v.trim()).filter(v => v.length > 0)
                    })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    placeholder="Elegância, Transparência, Alto Padrão"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={savingAction === "about"}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all flex items-center gap-2 ${
                    successAction === "about" 
                      ? "bg-[#25D366] text-white" 
                      : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                  }`}
                >
                  {savingAction === "about" ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Gravando secção institucional...</span>
                    </>
                  ) : successAction === "about" ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>✓ Dados Gravados com Sucesso!</span>
                    </>
                  ) : (
                    <span>Salvar Valores Institucionais</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: HOST */}
          {activeTab === "host" && hostSettings && (
            <div className="space-y-4 overflow-y-auto h-full pr-1">
              <div className="border-b border-[#c0c9c2]/30 pb-3">
                <h2 className="font-display font-bold text-xl text-[#023625]">Gerenciar Perfil do Anfitrião</h2>
                <p className="text-xs text-[#414944] mt-0.5">Altere foto, nome, cargo, mensagem de boas-vindas do anfitrião.</p>
              </div>

              <form onSubmit={handleSaveHostInfo} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={hostSettings.name}
                    onChange={(e) => setHostSettings({ ...hostSettings, name: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Cargo / Função</label>
                    <input 
                      type="text"
                      required
                      value={hostSettings.role}
                      onChange={(e) => setHostSettings({ ...hostSettings, role: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">WhatsApp direto do Anfitrião</label>
                    <input 
                      type="text"
                      value={hostSettings.id || ""}
                      onChange={(e) => setHostSettings({ ...hostSettings, id: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                      placeholder="Ex: +258840000000"
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Retrato Fotográfico do Anfitrião</label>
                  
                  <div className="space-y-2.5">
                    <input 
                      type="text"
                      required
                      value={hostSettings.photo_url}
                      onChange={(e) => setHostSettings({ ...hostSettings, photo_url: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-white"
                      placeholder="URL da foto ou faça upload abaixo..."
                    />
                    
                    <div className="flex items-center justify-between border border-dashed border-[#c0c9c2] p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-xs font-semibold text-[#023625]">Carregar Foto de Perfil Real</p>
                        <p className="text-[10px] text-[#414944] mt-0.5">Selecione uma imagem para atualizar instantaneamente o seu retrato.</p>
                      </div>
                      <label className="bg-[#fdcd78] hover:bg-[#e3b25f] text-[#023625] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1">
                        <Upload size={14} />
                        <span>Escolher Retrato</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            if (file.size > 2 * 1024 * 1024) {
                              alert("A imagem ultrapassa o limite de 2MB permitidos.");
                              return;
                            }

                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              if (base64) {
                                setHostSettings({ ...hostSettings, photo_url: base64 });
                                showFeedback("Retrato carregado provisoriamente! Lembre-se de clicar em salvar no fim.");
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {hostSettings.photo_url && (
                    <div className="flex items-center gap-3 mt-3">
                      <img 
                        src={hostSettings.photo_url} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#023625]/20 shadow-sm" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-[#414944] italic">Pré-visualização da foto selecionada</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Mensagem de Boas-vindas Curta</label>
                  <input 
                    type="text"
                    required
                    value={hostSettings.welcome_message}
                    onChange={(e) => setHostSettings({ ...hostSettings, welcome_message: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    placeholder="Seja muito bem-vindo à Enclave..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Biografia Resumida</label>
                  <textarea 
                    rows={4}
                    required
                    value={hostSettings.bio}
                    onChange={(e) => setHostSettings({ ...hostSettings, bio: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={savingAction === "host"}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all flex items-center gap-2 ${
                    successAction === "host" 
                      ? "bg-[#25D366] text-white" 
                      : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                  }`}
                >
                  {savingAction === "host" ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Atualizando perfil do anfitrião...</span>
                    </>
                  ) : successAction === "host" ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>✓ Perfil Atualizado com Sucesso!</span>
                    </>
                  ) : (
                    <span>Salvar Perfil de Anfitrião</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: CONTACTS */}
          {activeTab === "contacts" && contactsSettings && (
            <div className="space-y-4 overflow-y-auto h-full pr-1">
              <div className="border-b border-[#c0c9c2]/30 pb-3">
                <h2 className="font-display font-bold text-xl text-[#023625]">Configurar Contactos & Redes Sociais</h2>
                <p className="text-xs text-[#414944] mt-0.5">Altere os meios de contacto gerais exibidos ao público e nos canais automatizados.</p>
              </div>

              <form onSubmit={handleSaveContactsInfo} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">WhatsApp Principal Geral</label>
                  <input 
                    type="text"
                    required
                    value={contactsSettings.whatsapp_number}
                    onChange={(e) => setContactsSettings({ ...contactsSettings, whatsapp_number: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Telefone Principal</label>
                  <input 
                    type="text"
                    required
                    value={contactsSettings.phone}
                    onChange={(e) => setContactsSettings({ ...contactsSettings, phone: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Correio Eletrónico Geral (Email)</label>
                  <input 
                    type="email"
                    required
                    value={contactsSettings.email}
                    onChange={(e) => setContactsSettings({ ...contactsSettings, email: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Endereço de Escritório (Moçambique)</label>
                    <input 
                      type="text"
                      required
                      value={contactsSettings.address}
                      onChange={(e) => setContactsSettings({ ...contactsSettings, address: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Endereço de Escritório (Zimbabwe)</label>
                    <input 
                      type="text"
                      required
                      value={contactsSettings.address_zw || ""}
                      onChange={(e) => setContactsSettings({ ...contactsSettings, address_zw: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                      placeholder="Ex: Fife Street, Harare, Zimbabwe"
                    />
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-[#023625] uppercase tracking-wide">Coordenadas para Mapa no Contacto</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Insira as coordenadas geográficas (latitude e longitude) para carregar os mapas dinâmicos da Google. Pode consultar estes valores clicando com o botão direito no destino pretendido no Google Maps.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-white bg-white p-3.5 rounded-lg space-y-3 shadow-xs">
                      <span className="text-[10px] font-bold text-[#7b580b] uppercase tracking-widest block font-display">Filial: Moçambique</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-[#023625] uppercase">Latitude</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: -19.1164"
                            value={contactsSettings.latitude_mz || ""}
                            onChange={(e) => setContactsSettings({ ...contactsSettings, latitude_mz: e.target.value })}
                            className="w-full border border-[#c0c9c2] px-2.5 py-1.5 rounded text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#023625] uppercase">Longitude</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: 33.4833"
                            value={contactsSettings.longitude_mz || ""}
                            onChange={(e) => setContactsSettings({ ...contactsSettings, longitude_mz: e.target.value })}
                            className="w-full border border-[#c0c9c2] px-2.5 py-1.5 rounded text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-white bg-white p-3.5 rounded-lg space-y-3 shadow-xs">
                      <span className="text-[10px] font-bold text-[#7b580b] uppercase tracking-widest block font-display">Filial: Zimbabwe</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-[#023625] uppercase">Latitude</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: -18.9701"
                            value={contactsSettings.latitude_zw || ""}
                            onChange={(e) => setContactsSettings({ ...contactsSettings, latitude_zw: e.target.value })}
                            className="w-full border border-[#c0c9c2] px-2.5 py-1.5 rounded text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#023625] uppercase">Longitude</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: 32.6685"
                            value={contactsSettings.longitude_zw || ""}
                            onChange={(e) => setContactsSettings({ ...contactsSettings, longitude_zw: e.target.value })}
                            className="w-full border border-[#c0c9c2] px-2.5 py-1.5 rounded text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Link Instagram</label>
                    <input 
                      type="text"
                      required
                      value={contactsSettings.instagram_url}
                      onChange={(e) => setContactsSettings({ ...contactsSettings, instagram_url: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Link Facebook</label>
                    <input 
                      type="text"
                      required
                      value={contactsSettings.facebook_url}
                      onChange={(e) => setContactsSettings({ ...contactsSettings, facebook_url: e.target.value })}
                      className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase mb-1">Formspree Form ID (Para Formulário de Contactação)</label>
                  <input 
                    type="text"
                    placeholder="Ex: xeedylwp"
                    value={contactsSettings.formspree_id || ""}
                    onChange={(e) => setContactsSettings({ ...contactsSettings, formspree_id: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm font-mono"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Insira o ID do seu formulário do Formspree para receber mensagens dos hóspedes directamente no seu correio eletrónico.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={savingAction === "contacts"}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all flex items-center gap-2 ${
                    successAction === "contacts" 
                      ? "bg-[#25D366] text-white" 
                      : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                  }`}
                >
                  {savingAction === "contacts" ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando contactos e redes...</span>
                    </>
                  ) : successAction === "contacts" ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>✓ Contactos Gravados de Imediato!</span>
                    </>
                  ) : (
                    <span>Salvar Contactos Centrais</span>
                  )}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ACCOMMODATION CREATION / EDIT ORM MODAL CONTAINER */}
      {isEditingAcc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 font-sans border">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="font-display font-bold text-lg text-[#023625]">
                {editingAcc.id ? "Editar Acomodação" : "Nova Acomodação"}
              </h3>
              <button 
                onClick={() => { setIsEditingAcc(false); setEditingAcc({}); }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAccommodation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">Nome da Acomodação *</label>
                  <input 
                    type="text"
                    required
                    value={editingAcc.name || ""}
                    onChange={(e) => setEditingAcc({ ...editingAcc, name: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-white"
                    placeholder="Ex: Villa Verde Luxo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">Cidade *</label>
                  <select 
                    required
                    value={editingAcc.city || "Chimoio"}
                    onChange={(e) => setEditingAcc({ ...editingAcc, city: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-white"
                  >
                    <option value="Chimoio">Chimoio (Moçambique)</option>
                    <option value="Mutare">Mutare (Zimbabwe)</option>
                    <option value="Nyanga">Nyanga (Zimbabwe)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">País *</label>
                  <input 
                    type="text"
                    required
                    value={editingAcc.country || ""}
                    onChange={(e) => setEditingAcc({ ...editingAcc, country: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-white"
                    placeholder="Ex: Moçambique"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">Preço por Noite (MT) *</label>
                  <input 
                    type="number"
                    required
                    value={editingAcc.price_per_night || ""}
                    onChange={(e) => setEditingAcc({ ...editingAcc, price_per_night: Number(e.target.value) })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-white"
                    placeholder="Ex: 8500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">Descrição Detalhada *</label>
                <textarea 
                  rows={3}
                  required
                  value={editingAcc.description || ""}
                  onChange={(e) => setEditingAcc({ ...editingAcc, description: e.target.value })}
                  className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-white"
                  placeholder="Explique os pontos fortes e características ..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">Quartos *</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={editingAcc.bedrooms || 1}
                    onChange={(e) => setEditingAcc({ ...editingAcc, bedrooms: Number(e.target.value) })}
                    className="w-full border border-[#c0c9c2] px-2 py-1.5 rounded-lg text-xs bg-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">Camas *</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={editingAcc.beds || 1}
                    onChange={(e) => setEditingAcc({ ...editingAcc, beds: Number(e.target.value) })}
                    className="w-full border border-[#c0c9c2] px-2 py-1.5 rounded-lg text-xs bg-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">Banhos *</label>
                  <input 
                    type="number"
                    required
                    min={0.5}
                    step={0.5}
                    value={editingAcc.bathrooms || 1}
                    onChange={(e) => setEditingAcc({ ...editingAcc, bathrooms: Number(e.target.value) })}
                    className="w-full border border-[#c0c9c2] px-2 py-1.5 rounded-lg text-xs bg-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#023625] uppercase tracking-wider mb-1">Hóspedes Máx *</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={editingAcc.max_guests || 2}
                    onChange={(e) => setEditingAcc({ ...editingAcc, max_guests: Number(e.target.value) })}
                    className="w-full border border-[#c0c9c2] px-2 py-1.5 rounded-lg text-xs bg-white text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">Link Google Maps</label>
                  <input 
                    type="text"
                    value={editingAcc.google_maps_link || ""}
                    onChange={(e) => setEditingAcc({ ...editingAcc, google_maps_link: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-[#f9f9f9]"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#023625] uppercase tracking-wider mb-1">WhatsApp Específico da Acomodação</label>
                  <input 
                    type="text"
                    value={editingAcc.whatsapp_number || ""}
                    onChange={(e) => setEditingAcc({ ...editingAcc, whatsapp_number: e.target.value })}
                    className="w-full border border-[#c0c9c2] px-3 py-2 rounded-lg text-sm bg-[#f9f9f9]"
                    placeholder="Ex: +258840000000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => { setIsEditingAcc(false); setEditingAcc({}); }}
                  className="w-1/2 border border-[#c0c9c2] py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={savingAction === "acc"}
                  className={`w-1/2 py-2.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    successAction === "acc" 
                      ? "bg-[#25D366] text-white" 
                      : "bg-[#023625] text-white hover:bg-[#1f4d3a]"
                  }`}
                >
                  {savingAction === "acc" ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verificando dados...</span>
                    </>
                  ) : successAction === "acc" ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>✓ Confirmado!</span>
                    </>
                  ) : (
                    <span>Salvar Dados</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
