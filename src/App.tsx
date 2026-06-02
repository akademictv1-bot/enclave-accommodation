import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, ArrowRight, MessageSquare, 
  CheckCircle2, ExternalLink, ArrowLeft
} from "lucide-react";
import { Accommodation, AccommodationImage, Amenity } from "./types";
import { 
  dbService, 
  checkFirestoreConnection,
  isFirestoreConnected,
  syncLocalToFirestore,
  HomepageSettings, 
  AboutSectionSettings, 
  HostSettings, 
  ContactsSettings,
  defaultHomepage,
  defaultAbout,
  defaultHost,
  defaultContacts
} from "./firebaseClient";
import { PublicHeader } from "./components/PublicHeader";
import { AccommodationCard } from "./components/AccommodationCard";
import { PublicFooter } from "./components/PublicFooter";
import { AdminPanel } from "./components/AdminPanel";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { AboutPage } from "./components/AboutPage";
import { AboutSection } from "./components/AboutSection";
import { MapSection } from "./components/MapSection";
import { FormularioReserva } from "./components/FormularioReserva";

type Language = "pt" | "en";

const HERO_IMAGES = [
  "https://i.ibb.co/JwzytgMh/Whats-App-Image-2026-06-02-at-11-10-50.jpg",
  "https://i.ibb.co/r2jx7SSb/Whats-App-Image-2026-06-02-at-11-10-51.jpg",
  "https://i.ibb.co/zhdnNvgN/Whats-App-Image-2026-06-02-at-11-10-48.jpg"
];

export default function App() {
  // Navigation & Views
  const [selectedAcc, setSelectedAcc] = useState<Accommodation | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentFilterCity, setCurrentFilterCity] = useState<string>("todos");
  const [language, setLanguage] = useState<Language>("pt");

  // Hero Carousel Slide State
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Dynamic States from DB
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [images, setImages] = useState<AccommodationImage[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  
  // Custom Dynamic Content States from Firebase Firestore
  const [homepage, setHomepage] = useState<HomepageSettings | null>(null);
  const [about, setAbout] = useState<AboutSectionSettings | null>(null);
  const [host, setHost] = useState<HostSettings | null>(null);
  const [contacts, setContacts] = useState<ContactsSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Contact Form States
  // (moved to ContactSection component)

  // Active slideshow timers
  useEffect(() => {
    const listLen = homepage?.carousel_images?.length || HERO_IMAGES.length;
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % listLen);
    }, 6000);
    return () => clearInterval(timer);
  }, [homepage?.carousel_images]);

  // Hidden admin url access popstate/hashstate handler
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.toLowerCase();
      if (
        path === "/admin-login" || 
        path === "/dashboard-login" || 
        hash === "#/admin-login" || 
        hash === "#/dashboard-login" ||
        hash === "#admin-login" ||
        hash === "#acesso-restrito-enclave" ||
        hash === "#/acesso-restrito-enclave" ||
        hash === "#master-control-enclave"
      ) {
        setIsAdminOpen(true);
      }
    };
    checkAdminRoute();
    window.addEventListener("hashchange", checkAdminRoute);
    window.addEventListener("popstate", checkAdminRoute);
    return () => {
      window.removeEventListener("hashchange", checkAdminRoute);
      window.removeEventListener("popstate", checkAdminRoute);
    };
  }, []);

  // Detail View Dynamic Photo Slider State
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Public Booking Form Inputs
  // (Moved to FormularioReserva component)

  // Track current load to prevent stale overwrites
  const loadIdRef = useRef(0);

  useEffect(() => {
    const thisLoad = ++loadIdRef.current;
    loadPublicData(thisLoad);
  }, [isAdminOpen]);

  const loadPublicData = async (loadId?: number) => {
    setIsLoading(true);

    const isLatest = () => loadId === undefined || loadId === loadIdRef.current;

    // 1. Accommodations
    const accList = await dbService.getAccommodations();
    if (isLatest()) setAccommodations(accList);

    // 2. Images
    const imgList = await dbService.getImages();
    if (isLatest()) setImages(imgList);

    // 3. Amenities
    const amList = await dbService.getAmenities();
    if (isLatest()) setAmenities(amList);

    // 4. Homepage Settings
    let homeData = await dbService.getHomepage();
    if (homeData.carousel_images && homeData.carousel_images.length > 0) {
      const hasOldUrls = homeData.carousel_images.some(url => 
        url.includes("images.unsplash.com") || url.includes("googleusercontent.com")
      );
      if (hasOldUrls) {
        homeData = {
          ...homeData,
          carousel_images: [
            "https://i.ibb.co/JwzytgMh/Whats-App-Image-2026-06-02-at-11-10-50.jpg",
            "https://i.ibb.co/r2jx7SSb/Whats-App-Image-2026-06-02-at-11-10-51.jpg",
            "https://i.ibb.co/zhdnNvgN/Whats-App-Image-2026-06-02-at-11-10-48.jpg"
          ]
        };
        dbService.saveHomepage(homeData).catch(() => {});
      }
    }
    if (isLatest()) setHomepage(homeData);

    // 5. About Settings
    const aboutData = await dbService.getAbout();
    if (isLatest()) setAbout(aboutData);

    // 6. Host Details
    const hostData = await dbService.getHost();
    if (isLatest()) setHost(hostData);

    // 7. Contacts Details
    const contactsData = await dbService.getContacts();
    if (isLatest()) setContacts(contactsData);

    setIsLoading(false);
  };

  const navigateToSection = (sectionId: string) => {
    setSelectedAcc(null);
    setIsPrivacyOpen(false);
    setIsTermsOpen(false);
    setIsAboutOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleSelectAccommodation = (acc: Accommodation) => {
    setSelectedAcc(acc);
    setIsPrivacyOpen(false);
    setIsTermsOpen(false);
    setIsAboutOpen(false);
    setActivePhotoIndex(0);
    // Clear booking form states
    setActivePhotoIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter listings
  const filteredAccommodations = currentFilterCity === "todos"
    ? accommodations
    : accommodations.filter(acc => acc.city.toLowerCase() === currentFilterCity.toLowerCase());

  // Extract cities
  const cities = ["todos", "Chimoio", "Mutare", "Nyanga"];
  const selectedAccImages = selectedAcc
    ? images.filter(img => img.accommodation_id === selectedAcc.id)
    : [];
  const selectedAccAmenities = selectedAcc
    ? amenities.filter(am => am.accommodation_id === selectedAcc.id)
    : [];
  const text = (pt: string, en: string) => language === "pt" ? pt : en;
  const countryName = (country: string) => {
    if (language === "pt" && country.toLowerCase() === "mozambique") return "Moçambique";
    return country;
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased">
      {/* Header element */}
      <PublicHeader 
        onNavigate={navigateToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* RENDER VIEW 1: PRIVACY POLICY PAGE, TERMS PAGE, and ABOUT PAGE */}
      {isPrivacyOpen ? (
        <main className="pt-20">
          <PrivacyPage onClose={() => setIsPrivacyOpen(false)} />
        </main>
      ) : isTermsOpen ? (
        <main className="pt-20">
          <TermsPage onClose={() => setIsTermsOpen(false)} />
        </main>
      ) : isAboutOpen ? (
        <main>
          <AboutPage 
            about={about}
            host={host}
            contacts={contacts}
            language={language}
            onClose={() => {
              setIsAboutOpen(false);
              navigateToSection("acomodacoes");
            }}
          />
        </main>
      ) : selectedAcc ? (
        <main className="pt-28 md:pt-32 pb-16">
          <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8">
            {/* Back to top nav */}
            <button 
              onClick={() => setSelectedAcc(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#023625] hover:text-[#7b580b] mb-6 transition-colors group cursor-pointer"
            >
              <ArrowLeft size={16} className="transform transition-transform group-hover:-translate-x-1" />
              <span>{text("Voltar para as Acomodações", "Back to Accommodations")}</span>
            </button>

            {/* Gallery + Booking side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_440px] gap-6 xl:gap-10 items-start w-full">
              {/* Left: Gallery Column */}
              <div className="space-y-4">
                {/* Main big preview */}
                <div className="h-[400px] sm:h-[500px] md:h-[580px] xl:h-[660px] overflow-hidden rounded-xl shadow-md border border-[#c0c9c2]/50 relative bg-white">
                  {selectedAccImages.length > 0 ? (
                    <img 
                      src={selectedAccImages[activePhotoIndex]?.image_url} 
                      alt={selectedAcc.name} 
                      className="block w-full h-full object-cover object-center transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e2e2e2] flex items-center justify-center text-[#414944] italic text-sm">
                      {text("Nenhuma foto cadastrada pelo administrador.", "No photo has been added by the administrator.")}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#023625] text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm">
                    ★ 4.9 (128 {text("Avaliações", "Reviews")})
                  </div>
                </div>

                {/* Thumbnail strip below */}
                <div className="hidden sm:flex gap-3 h-24">
                  {selectedAccImages.slice(0, 4).map((img, idx) => (
                    <div 
                      key={img.id}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`flex-1 overflow-hidden rounded-xl shadow-sm cursor-pointer border-2 transition-all ${activePhotoIndex === idx ? "border-[#7b580b] scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"}`}
                    >
                      <img src={img.image_url} alt={selectedAcc.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {selectedAccImages.length < 4 && (
                    <div className="flex-1 bg-[#eeeeee] rounded-xl flex items-center justify-center text-xs text-gray-400 italic">
                      {text("Adicione mais fotos no Admin", "Add more photos in Admin")}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Floating Booking Card */}
              <div className="w-full lg:sticky lg:top-28">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#c0c9c2]/30">
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-4 mb-6">
                    <div>
                      <span className="font-display font-bold text-2xl text-[#023625]">
                        {selectedAcc.price_per_night.toLocaleString("pt-MZ")} MT
                      </span>
                      <span className="text-xs text-[#414944] font-medium block">{text("por noite", "per night")}</span>
                    </div>
                    <span className="bg-[#fdcd78] text-[#785508] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      Best Value
                    </span>
                  </div>

                  <FormularioReserva 
                    accommodationName={selectedAcc.name}
                    accommodationLocation={`${selectedAcc.city}, ${countryName(selectedAcc.country)}`}
                    pricePerNight={selectedAcc.price_per_night}
                    destinationWhatsapp={selectedAcc.whatsapp_number || contacts?.whatsapp_number || "+26377735000"}
                    language={language}
                  />
                </div>
              </div>
            </div>

            {/* Property Info Card - Below Gallery */}
            <section className="bg-white rounded-xl border border-[#c0c9c2]/35 shadow-sm p-5 md:p-7 mt-10">
              <div className="pb-6 border-b border-[#c0c9c2]/30">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-[#023625] tracking-tight mb-2">
                  {selectedAcc.name}
                </h1>
                <p className="font-sans text-sm text-[#414944] flex items-center gap-1.5 font-medium">
                  <MapPin size={16} className="text-[#7b580b]" />
                  <span>{selectedAcc.city}, {countryName(selectedAcc.country)}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 py-6 text-center">
                <div className="bg-[#f3f3f3] p-4 rounded-lg flex flex-col items-center min-h-24 justify-center">
                  <span className="font-display font-medium text-2xl text-[#023625] leading-none mb-1">
                    {selectedAcc.bedrooms}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#414944]">{text("Quartos", "Rooms")}</span>
                </div>
                <div className="bg-[#f3f3f3] p-4 rounded-lg flex flex-col items-center min-h-24 justify-center">
                  <span className="font-display font-medium text-2xl text-[#023625] leading-none mb-1">
                    {selectedAcc.beds}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#414944]">{text("Camas", "Beds")}</span>
                </div>
                <div className="bg-[#f3f3f3] p-4 rounded-lg flex flex-col items-center min-h-24 justify-center">
                  <span className="font-display font-medium text-2xl text-[#023625] leading-none mb-1">
                    {selectedAcc.bathrooms}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#414944]">{text("Casas de Banho", "Bathrooms")}</span>
                </div>
                <div className="bg-[#f3f3f3] p-4 rounded-lg flex flex-col items-center min-h-24 justify-center">
                  <span className="font-display font-medium text-2xl text-[#023625] leading-none mb-1">
                    {selectedAcc.max_guests}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#414944]">{text("Hóspedes Máx", "Max Guests")}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#c0c9c2]/30">
                <h3 className="font-display font-bold text-xl text-[#023625] mb-4">{text("Sobre este santuário", "About this sanctuary")}</h3>
                <p className="text-[#414944] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {selectedAcc.description}
                </p>
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-white rounded-xl border border-[#c0c9c2]/35 shadow-sm p-5 md:p-7 mt-6">
              <h3 className="font-display font-bold text-xl text-[#023625] mb-4">{text("O que este lugar oferece", "What this place offers")}</h3>
              {selectedAccAmenities.length === 0 ? (
                <p className="text-sm text-gray-400 italic">{text("Lista de utilidades pendente.", "Amenities list pending.")}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedAccAmenities.map((am) => (
                    <div key={am.id} className="flex items-center gap-3 text-sm text-[#414944] font-medium bg-[#f9f9f9] p-3 rounded-lg border border-gray-100 shadow-xs">
                      <CheckCircle2 size={16} className="text-[#023625] shrink-0" />
                      <span>{am.amenity_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Location */}
            <section className="bg-white rounded-xl border border-[#c0c9c2]/35 shadow-sm p-5 md:p-7 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-xl text-[#023625]">{text("Localização", "Location")}</h3>
                <a 
                  href={selectedAcc.google_maps_link || "https://maps.google.com"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#7b580b] hover:text-[#023625] flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>{text("Abrir no Google Maps", "Open in Google Maps")}</span>
                </a>
              </div>
              <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <iframe 
                  title={text("Mapa da acomodação", "Accommodation map")}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedAcc.google_maps_link?.split("?q=")[1]?.split("&")[0] 
                    || `${selectedAcc.city}, ${selectedAcc.country}`
                  )}&output=embed`}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                  allowFullScreen={false}
                />
              </div>
            </section>
          </div>

          {/* About Section - Display host info for affiliated properties */}
          <div className="mt-16 pt-8 border-t border-gray-200/60">
            <AboutSection about={about} host={host} language={language} />
          </div>
        </main>
      ) : (
        /* RENDER VIEW 2: MAIN PUBLIC SITE LANDING VIEW */
        <main>
          {/* Elegant Hero Carousel Section & Catchphrase matching mockup */}
          <section id="hero" className="relative h-[85vh] min-h-[580px] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 hero-gradient z-10 animate-fade-in" />
              {(homepage?.carousel_images || HERO_IMAGES).map((imgUrl, index) => (
                <img 
                  key={index}
                  src={imgUrl} 
                  alt={`Santuário Enclave ${index + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover select-none transition-all duration-[2000ms] ease-in-out transform ${
                    index === currentHeroImage 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 w-full text-white">
              <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
                <span className="text-[#a1d1b8] font-sans font-semibold text-xs uppercase tracking-widest block mb-4">
                  {language === "pt" ? (homepage?.hero_badge || "Santuários sob medida") : "Tailored Sanctuaries"}
                </span>
                <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-5xl text-white tracking-tight leading-tight text-shadow-md lg:leading-tight">
                  {language === "pt" ? (homepage?.hero_title || "Descubra o conforto perfeito em Chimoio, Mutare e Nyanga.") : "Discover refined stays in Chimoio, Mutare and Nyanga."}
                </h1>
                <p className="font-sans text-xs md:text-sm text-[#bceed3] opacity-95 mt-5 max-w-2xl leading-relaxed text-shadow-sm mx-auto">
                  {language === "pt" ? (homepage?.hero_subtitle || "Acomodações sofisticadas e meticulosamente preparadas para famílias, diplomatas, turistas e profissionais exigentes em Moçambique e Zimbabwe.") : "Sophisticated accommodation prepared for families, diplomats, tourists and demanding professionals in Mozambique and Zimbabwe."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center items-center w-full">
                  <button 
                    onClick={() => navigateToSection("acomodacoes")}
                    className="bg-[#7b580b] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#7b580b]/90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 w-full sm:w-auto text-center font-bold"
                  >
                    <span>{text("Ver Acomodações", "View Accommodations")}</span>
                    <ArrowRight size={16} />
                  </button>
                  <a 
                    href={`https://wa.me/${(contacts?.whatsapp_number || "+26377735000").replace(/\D/g, "")}?text=${encodeURIComponent(text("Olá. Gostaria de saber mais sobre as acomodações Enclave.", "Hello. I would like to know more about Enclave accommodations."))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center font-bold"
                  >
                    <MessageSquare size={16} />
                    <span>{text("Falar no WhatsApp", "WhatsApp Us")}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Promo Highlight Ribbon */}
          <div className="bg-[#023625] text-[#bceed3] py-10 border-y border-white/10 shrink-0">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                <span className="text-[#fdcd78] font-sans text-[10px] font-bold uppercase tracking-widest block mb-1">{text("Destaque Exclusivo", "Exclusive Highlight")}</span>
                <h3 className="font-display font-extrabold text-white text-lg leading-snug">
                  {language === "pt" ? (homepage?.promo_title || "Experiência Exclusiva e Curadoria de Alto Nível") : "Exclusive Experience and High-Level Curation"}
                </h3>
              </div>
              <p className="md:col-span-8 text-xs leading-relaxed opacity-90 pl-0 md:pl-2">
                {language === "pt" ? (homepage?.promo_text || "Cada santuário Enclave é integralmente gerido para oferecer privacidade impecável, internet de altíssima velocidade e suporte centralizado para nossos hóspedes.") : "Every Enclave sanctuary is managed to offer privacy, high-speed internet and centralized guest support."}
              </p>
            </div>
          </div>

          {/* Interactive filter tabs & accommodations grid area */}
          <section id="acomodacoes" className="pt-16 pb-8 bg-white">
            <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-5">
                <div>
                  <span className="text-[#7b580b] text-xs font-semibold uppercase tracking-widest block mb-2">{text("Destinos de Prestígio", "Prestige Destinations")}</span>
                  <h2 className="font-display font-extrabold text-3xl text-[#023625]">{text("Nossas Acomodações", "Our Accommodations")}</h2>
                  <p className="text-sm text-[#414944] mt-1">{text("Refúgios sofisticados selecionados a dedo no coração da região.", "Sophisticated stays hand-picked in the heart of the region.")}</p>
                </div>

                {/* City Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setCurrentFilterCity(city)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        currentFilterCity === city 
                          ? "bg-[#023625] text-white shadow-sm font-bold" 
                          : "bg-[#f3f3f3] text-[#414944] hover:bg-[#eeeeee]"
                      }`}
                    >
                      {city === "todos" ? text("Todos os locais", "All locations") : city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loader */}
              {isLoading ? (
                <div className="py-20 text-center text-[#023625] italic text-sm">
                  <span>{text("Carregando santuários de prestígio...", "Loading prestige sanctuaries...")}</span>
                </div>
              ) : filteredAccommodations.length === 0 ? (
                <div className="py-20 text-center text-gray-400 font-medium italic border rounded-xl bg-gray-50">
                  {text("Nenhuma acomodação ativa registrada para este destino.", "No active accommodation registered for this destination.")}
                </div>
              ) : (
                /* Grid cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7">
                  {filteredAccommodations.map((acc, index) => {
                    // Match its corresponding photographs
                    const accImgs = images
                      .filter(img => img.accommodation_id === acc.id)
                      .map(img => img.image_url);
                    return (
                      <AccommodationCard 
                        key={acc.id}
                        accommodation={acc}
                        imageUrls={accImgs}
                        featured={index === 0}
                        onSelect={handleSelectAccommodation}
                        language={language}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Map section moved to homepage */}
          <MapSection contacts={contacts} language={language} />
        </main>
      )}

      {/* Footer block */}
      <PublicFooter 
        onNavigate={navigateToSection} 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        language={language}
      />

      {/* RENDER MODAL VIEW 2: ADMIN PANEL CRUD ACCESS */}
      {isAdminOpen && (
        <AdminPanel onClose={() => {
          setIsAdminOpen(false);
          // Clean the hidden route so user can escape panel smoothly
          const h = window.location.hash.toLowerCase();
          if (
            h.startsWith("#/admin-login") || 
            h.startsWith("#admin-login") ||
            h.startsWith("#acesso-restrito-enclave") ||
            h.startsWith("#/acesso-restrito-enclave") ||
            h.startsWith("#master-control-enclave")
          ) {
            window.location.hash = "";
          }
        }} />
      )}
    </div>
  );
}
