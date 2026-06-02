import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where,
  enableIndexedDbPersistence
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { Accommodation, AccommodationImage, Amenity, Host, Settings } from "./types";
import { initialAccommodations, initialAmenities, initialImages, initialHost, initialSettings } from "./initialData";

// User's custom Firebase configuration provided directly
const userFirebaseConfig = {
  apiKey: "AIzaSyD-XbYud02AJ1K35b4QS7EpNyKOx3i54ls",
  authDomain: "enclave-acomo.firebaseapp.com",
  projectId: "enclave-acomo",
  storageBucket: "enclave-acomo.firebasestorage.app",
  messagingSenderId: "479815785927",
  appId: "1:479815785927:web:a0ab92f47e6b4dff908de2",
  measurementId: "G-XL9NYYQ4R8"
};

const app = initializeApp(userFirebaseConfig);
// Default Firestore database ID fits the user's manual configuration
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence for better reliability
enableIndexedDbPersistence(db).catch(() => {});

// Track connection state
let _firestoreConnected: boolean | null = null;
let _lastCheck = 0;

export async function checkFirestoreConnection(): Promise<boolean> {
  // Avoid hammering Firestore on rapid re-checks
  const now = Date.now();
  if (now - _lastCheck < 5000 && _firestoreConnected !== null) return _firestoreConnected;
  _lastCheck = now;

  try {
    // Use a simple null doc to test connectivity (doesn't require the doc to exist)
    await getDoc(doc(db, "_ping_", "_ping_"));
    _firestoreConnected = true;
    return true;
  } catch (e) {
    _firestoreConnected = false;
    return false;
  }
}

export function isFirestoreConnected(): boolean | null {
  return _firestoreConnected;
}

// Force-sync all local data to Firestore
export async function syncLocalToFirestore(): Promise<void> {
  // Sync accommodations
  const accs = getLocalStorageItem<Accommodation[]>("local_accommodations", initialAccommodations);
  for (const acc of accs) {
    try {
      await setDoc(doc(db, "accommodations", acc.id), acc);
    } catch (e) {
      console.warn("sync: falha ao salvar acomodação", acc.id, e);
    }
  }

  // Sync images
  const imgs = getLocalStorageItem<AccommodationImage[]>("local_images", initialImages);
  for (const img of imgs) {
    try {
      await setDoc(doc(db, "accommodation_images", img.id), img);
    } catch (e) {
      console.warn("sync: falha ao salvar imagem", img.id, e);
    }
  }

  // Sync amenities
  const ams = getLocalStorageItem<Amenity[]>("local_amenities", initialAmenities);
  for (const am of ams) {
    try {
      await setDoc(doc(db, "amenities", am.id), am);
    } catch (e) {
      console.warn("sync: falha ao salvar comodidade", am.id, e);
    }
  }

  // Sync settings
  const syncSetting = async (path: string, key: string, fallback: any) => {
    const data = getLocalStorageItem(key, fallback);
    try {
      await setDoc(doc(db, "settings", path), data);
    } catch (e) {
      console.warn(`sync: falha ao salvar ${path}`, e);
    }
  };
  await syncSetting("homepage", "local_homepage", defaultHomepage);
  await syncSetting("about", "local_about", defaultAbout);
  await syncSetting("host", "local_host", defaultHost);
  await syncSetting("contacts", "local_contacts", defaultContacts);
}

// Skill requirement: Firestore error handling with compliant JSON error scheme
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  if (errMsg.toLowerCase().includes("offline") || errMsg.toLowerCase().includes("network") || errMsg.toLowerCase().includes("failed to get document")) {
    console.warn("Firestore Mode: Offline/Cache. Utilizando dados integrados padrão. Info: ", JSON.stringify(errInfo));
  } else {
    console.error("Firestore Error: ", JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

// Unified Homepage Editable settings type
export interface HomepageSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  carousel_images: string[];
  promo_title: string;
  promo_text: string;
}

export const defaultHomepage: HomepageSettings = {
  id: "homepage",
  hero_title: "Descubra o conforto perfeito em Chimoio, Mutare e Nyanga.",
  hero_subtitle: "Acomodações sofisticadas e meticulosamente preparadas para famílias, diplomatas, turistas e profissionais exigentes em Moçambique e Zimbabwe.",
  hero_badge: "Santuários sob medida",
  carousel_images: [
    "https://i.ibb.co/JwzytgMh/Whats-App-Image-2026-06-02-at-11-10-50.jpg",
    "https://i.ibb.co/r2jx7SSb/Whats-App-Image-2026-06-02-at-11-10-51.jpg",
    "https://i.ibb.co/zhdnNvgN/Whats-App-Image-2026-06-02-at-11-10-48.jpg"
  ],
  promo_title: "Experiência Exclusiva e Curadoria de Alto Nível",
  promo_text: "Cada santuário Enclave é integralmente gerido para oferecer privacidade impecável, internet de altíssima velocidade e suporte personalizado."
};

// Unified About Section settings type
export interface AboutSectionSettings {
  id: string;
  title: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
  values: string[];
}

export const defaultAbout: AboutSectionSettings = {
  id: "about",
  title: "Sobre Nós",
  description: "A Enclave Accommodation nasceu da paixão por transformar estadias em experiências memoráveis.",
  history: "Com sede estratégica em Chimoio e expansão para Mutare e Nyanga, oferecemos mais do que um quarto; entregamos um santuário curado, pautado na sofisticação, no minimalismo estético e no profissionalismo absoluto.",
  mission: "Garantir conforto impecável, segurança integral e máxima discrição para hóspedes que exigem qualidade classe mundial.",
  vision: "Ser a marca de referência em hospitalidade de alto padrão nos principais eixos de Moçambique e Zimbabwe.",
  values: [
    "Hospitalidade Sob Medida",
    "Privacidade Absoluta",
    "Excelência Operacional",
    "Minimalismo e Elegância"
  ]
};

// Unified Host details
export interface HostSettings extends Host {
  role: string;
  welcome_message: string;
}

export const defaultHost: HostSettings = {
  id: "host",
  name: "António Enclave",
  photo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYE1ZY8w9_dj9OARYmF1NLXNizhShKsMICFQ5EbGcXFfI4g7Yv1uJax-c0114B3dQxvNH9dgRenGeKunc0gSiM-tOevfNVkQNXBR_hTgqsPksX0sfNQx9LfIPTz4skoiXndip-0OkvboPRjVMfTSXmmKhd6dx3FfqEn2QPQhFC1YTub7wR624NFSoxAXyvka8xvaN7kzMF-XQDja35_FzVr6KmwxZQlQdgnLy4pr37mzudoqvKPKlSH8xh7u2WgpGqz5kuiNuML4U",
  bio: "Com mais de 10 anos de experiência no sector de hospitalidade em Moçambique e Zimbabwe, garanto que sua estadia nas acomodações da Enclave seja sinônimo de segurança, luxo e tranquilidade absoluta.",
  role: "Fundador e Anfitrião",
  welcome_message: "Seja muito bem vindo à Enclave Accommodation. O seu bem-estar é o nosso compromisso."
};

// Unified Contacts details
export interface ContactsSettings {
  id: string;
  whatsapp_number: string;
  phone: string;
  email: string;
  address: string;
  address_zw?: string;
  instagram_url: string;
  facebook_url: string;
  formspree_id?: string;
  latitude_mz?: string;
  longitude_mz?: string;
  latitude_zw?: string;
  longitude_zw?: string;
}

export const defaultContacts: ContactsSettings = {
  id: "contacts",
  whatsapp_number: "+26377735000",
  phone: "+26377735000",
  email: "reservas@enclave.co.mz",
  address: "Avenida da Independência, Chimoio, Moçambique",
  address_zw: "Fife Street, Harare, Zimbabwe",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com",
  formspree_id: "xeedylwp",
  latitude_mz: "-19.1164",
  longitude_mz: "33.4833",
  latitude_zw: "-18.9701",
  longitude_zw: "32.6685"
};

function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Falha ao salvar no localStorage:", err);
  }
}

export const dbService = {
  // ACCOMMODATIONS
  async getAccommodations(): Promise<Accommodation[]> {
    try {
      const snap = await getDocs(collection(db, "accommodations"));
      const list: Accommodation[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Accommodation);
      });
      if (list.length === 0) {
        // Fallback to local cache or defaults if empty
        const cached = getLocalStorageItem<Accommodation[]>("local_accommodations", initialAccommodations);
        return cached;
      }
      setLocalStorageItem("local_accommodations", list);
      return list;
    } catch (err) {
      console.warn("dbService.getAccommodations: falha ao carregar do Firestore, usando cache local.");
      return getLocalStorageItem<Accommodation[]>("local_accommodations", initialAccommodations);
    }
  },

  async saveAccommodation(item: Omit<Accommodation, "id"> & { id?: string }): Promise<Accommodation> {
    const id = item.id || "acc-" + Math.random().toString(36).substr(2, 9);
    
    // Auto format cover images or properties that might be URLs
    let formattedDoc = { ...item };
    
    const docData: Accommodation = {
      ...formattedDoc,
      id,
      created_at: item.created_at || new Date().toISOString()
    };

    // Save to local cache first
    const list = getLocalStorageItem<Accommodation[]>("local_accommodations", initialAccommodations);
    const index = list.findIndex(acc => acc.id === id);
    if (index >= 0) {
      list[index] = docData;
    } else {
      list.push(docData);
    }
    setLocalStorageItem("local_accommodations", list);

    try {
      await setDoc(doc(db, "accommodations", id), docData);
    } catch (err) {
      console.warn("dbService.saveAccommodation: falha ao salvar no Firestore (offline), dados mantidos em cache local.");
    }
    return docData;
  },

  async deleteAccommodation(id: string): Promise<boolean> {
    // Remove from local cache
    const list = getLocalStorageItem<Accommodation[]>("local_accommodations", initialAccommodations);
    const updated = list.filter(acc => acc.id !== id);
    setLocalStorageItem("local_accommodations", updated);

    // Also remove from local images
    const localImgs = getLocalStorageItem<AccommodationImage[]>("local_images", initialImages);
    setLocalStorageItem("local_images", localImgs.filter(img => img.accommodation_id !== id));

    // Also remove from local amenities
    const localAms = getLocalStorageItem<Amenity[]>("local_amenities", initialAmenities);
    setLocalStorageItem("local_amenities", localAms.filter(am => am.accommodation_id !== id));

    try {
      await deleteDoc(doc(db, "accommodations", id));
      
      const imgSnap = await getDocs(query(collection(db, "accommodation_images"), where("accommodation_id", "==", id)));
      imgSnap.forEach(async (d) => {
        await deleteDoc(doc(db, "accommodation_images", d.id));
      });

      const amSnap = await getDocs(query(collection(db, "amenities"), where("accommodation_id", "==", id)));
      amSnap.forEach(async (d) => {
        await deleteDoc(doc(db, "amenities", d.id));
      });
    } catch (err) {
      console.warn("dbService.deleteAccommodation: offline ou erro de rede, excluído em cache local de forma transparente.");
    }
    return true;
  },

  // ACCOMMODATION IMAGES
  async getImages(accommodationId?: string): Promise<AccommodationImage[]> {
    try {
      const snap = await getDocs(collection(db, "accommodation_images"));
      const list: AccommodationImage[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as AccommodationImage);
      });
      
      if (list.length === 0) {
        // Fallback to local defaults if empty
        const cached = getLocalStorageItem<AccommodationImage[]>("local_images", initialImages);
        return accommodationId ? cached.filter(img => img.accommodation_id === accommodationId) : cached;
      }
      
      setLocalStorageItem("local_images", list);
      const res = accommodationId ? list.filter(img => img.accommodation_id === accommodationId) : list;
      return res;
    } catch (err) {
      console.warn("dbService.getImages: falha ao carregar, usando cache local.");
      const cached = getLocalStorageItem<AccommodationImage[]>("local_images", initialImages);
      return accommodationId ? cached.filter(img => img.accommodation_id === accommodationId) : cached;
    }
  },

  async addImage(accommodationId: string, url: string): Promise<AccommodationImage> {
    let imageUrl = url.trim();
    if (imageUrl && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:") && !imageUrl.startsWith("/")) {
      imageUrl = "https://" + imageUrl;
    }
    const id = "img-" + Math.random().toString(36).substr(2, 9);
    const newItem: AccommodationImage = {
      id,
      accommodation_id: accommodationId,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    };

    // Save to local cache first
    const list = getLocalStorageItem<AccommodationImage[]>("local_images", initialImages);
    list.push(newItem);
    setLocalStorageItem("local_images", list);

    try {
      await setDoc(doc(db, "accommodation_images", id), newItem);
    } catch (err) {
      console.warn("dbService.addImage: offline ou erro de permissão no Firebase, adicionado ao cache local do navegador.");
    }
    return newItem;
  },

  async deleteImage(id: string): Promise<boolean> {
    const list = getLocalStorageItem<AccommodationImage[]>("local_images", initialImages);
    const updated = list.filter(img => img.id !== id);
    setLocalStorageItem("local_images", updated);

    try {
      await deleteDoc(doc(db, "accommodation_images", id));
    } catch (err) {
      console.warn("dbService.deleteImage: offline, excluído em cache local.");
    }
    return true;
  },

  // AMENITIES
  async getAmenities(accommodationId?: string): Promise<Amenity[]> {
    try {
      const snap = await getDocs(collection(db, "amenities"));
      const list: Amenity[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Amenity);
      });
      
      if (list.length === 0) {
        const cached = getLocalStorageItem<Amenity[]>("local_amenities", initialAmenities);
        return accommodationId ? cached.filter(am => am.accommodation_id === accommodationId) : cached;
      }
      
      setLocalStorageItem("local_amenities", list);
      const res = accommodationId ? list.filter(am => am.accommodation_id === accommodationId) : list;
      return res;
    } catch (err) {
      console.warn("dbService.getAmenities: falha ao carregar, usando cache local.");
      const cached = getLocalStorageItem<Amenity[]>("local_amenities", initialAmenities);
      return accommodationId ? cached.filter(am => am.accommodation_id === accommodationId) : cached;
    }
  },

  async addAmenity(accommodationId: string, name: string): Promise<Amenity> {
    const id = "am-" + Math.random().toString(36).substr(2, 9);
    const newItem: Amenity = {
      id,
      accommodation_id: accommodationId,
      amenity_name: name
    };

    const list = getLocalStorageItem<Amenity[]>("local_amenities", initialAmenities);
    list.push(newItem);
    setLocalStorageItem("local_amenities", list);

    try {
      await setDoc(doc(db, "amenities", id), newItem);
    } catch (err) {
      console.warn("dbService.addAmenity: offline, cadastrado em cache local.");
    }
    return newItem;
  },

  async deleteAmenity(id: string): Promise<boolean> {
    const list = getLocalStorageItem<Amenity[]>("local_amenities", initialAmenities);
    const updated = list.filter(am => am.id !== id);
    setLocalStorageItem("local_amenities", updated);

    try {
      await deleteDoc(doc(db, "amenities", id));
    } catch (err) {
      console.warn("dbService.deleteAmenity: offline, excluído em cache local.");
    }
    return true;
  },

  // HOMEPAGE EDITABLE SECTION
  async getHomepage(): Promise<HomepageSettings> {
    try {
      const docSnap = await getDoc(doc(db, "settings", "homepage"));
      if (docSnap.exists()) {
        const data = docSnap.data() as HomepageSettings;
        setLocalStorageItem("local_homepage", data);
        return data;
      }
      return getLocalStorageItem<HomepageSettings>("local_homepage", defaultHomepage);
    } catch (err) {
      console.warn("dbService.getHomepage: offline, usando cache local.");
      return getLocalStorageItem<HomepageSettings>("local_homepage", defaultHomepage);
    }
  },

  async saveHomepage(data: HomepageSettings): Promise<HomepageSettings> {
    // Auto format any custom carousel URLs
    const formattedImages = (data.carousel_images || []).map(url => {
      let trimmed = url.trim();
      if (trimmed && !trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("data:") && !trimmed.startsWith("/")) {
        return "https://" + trimmed;
      }
      return trimmed;
    });

    const formattedData = {
      ...data,
      carousel_images: formattedImages
    };

    setLocalStorageItem("local_homepage", formattedData);
    try {
      await setDoc(doc(db, "settings", "homepage"), formattedData);
    } catch (err) {
      console.warn("dbService.saveHomepage: offline, salvo em cache local.");
    }
    return formattedData;
  },

  // ABOUT US EDITABLE SECTION
  async getAbout(): Promise<AboutSectionSettings> {
    try {
      const docSnap = await getDoc(doc(db, "settings", "about"));
      if (docSnap.exists()) {
        const data = docSnap.data() as AboutSectionSettings;
        setLocalStorageItem("local_about", data);
        return data;
      }
      return getLocalStorageItem<AboutSectionSettings>("local_about", defaultAbout);
    } catch (err) {
      console.warn("dbService.getAbout: offline, usando cache local.");
      return getLocalStorageItem<AboutSectionSettings>("local_about", defaultAbout);
    }
  },

  async saveAbout(data: AboutSectionSettings): Promise<AboutSectionSettings> {
    setLocalStorageItem("local_about", data);
    try {
      await setDoc(doc(db, "settings", "about"), data);
    } catch (err) {
      console.warn("dbService.saveAbout: offline, salvo em cache local.");
    }
    return data;
  },

  // HOST EDITABLE SECTION
  async getHost(): Promise<HostSettings> {
    try {
      const docSnap = await getDoc(doc(db, "settings", "host"));
      if (docSnap.exists()) {
        const data = docSnap.data() as HostSettings;
        setLocalStorageItem("local_host", data);
        return data;
      }
      return getLocalStorageItem<HostSettings>("local_host", defaultHost);
    } catch (err) {
      console.warn("dbService.getHost: offline, usando cache local.");
      return getLocalStorageItem<HostSettings>("local_host", defaultHost);
    }
  },

  async saveHost(data: HostSettings): Promise<HostSettings> {
    let photoUrl = data.photo_url.trim();
    if (photoUrl && !photoUrl.startsWith("http://") && !photoUrl.startsWith("https://") && !photoUrl.startsWith("data:") && !photoUrl.startsWith("/")) {
      photoUrl = "https://" + photoUrl;
    }
    const formattedData = {
      ...data,
      photo_url: photoUrl
    };

    setLocalStorageItem("local_host", formattedData);
    try {
      await setDoc(doc(db, "settings", "host"), formattedData);
    } catch (err) {
      console.warn("dbService.saveHost: offline, salvo em cache local.");
    }
    return formattedData;
  },

  // CONTACTS EDITABLE SECTION
  async getContacts(): Promise<ContactsSettings> {
    try {
      const docSnap = await getDoc(doc(db, "settings", "contacts"));
      if (docSnap.exists()) {
        const data = docSnap.data() as ContactsSettings;
        setLocalStorageItem("local_contacts", data);
        return data;
      }
      return getLocalStorageItem<ContactsSettings>("local_contacts", defaultContacts);
    } catch (err) {
      console.warn("dbService.getContacts: offline, usando cache local.");
      return getLocalStorageItem<ContactsSettings>("local_contacts", defaultContacts);
    }
  },

  async saveContacts(data: ContactsSettings): Promise<ContactsSettings> {
    setLocalStorageItem("local_contacts", data);
    try {
      await setDoc(doc(db, "settings", "contacts"), data);
    } catch (err) {
      console.warn("dbService.saveContacts: offline, salvo em cache local.");
    }
    return data;
  },

  // legacy Settings map to avoid breaking app bundle compiles
  async getSettings(): Promise<Settings> {
    const contacts = await this.getContacts();
    const about = await this.getAbout();
    return {
      id: "settings-1",
      company_name: "Enclave Accommodation",
      whatsapp_number: contacts.whatsapp_number,
      email: contacts.email,
      about_text: about.history
    };
  },

  async saveSettings(settings: Settings): Promise<Settings> {
    const about = await this.getAbout();
    const contacts = await this.getContacts();
    await this.saveAbout({
      ...about,
      history: settings.about_text
    });
    await this.saveContacts({
      ...contacts,
      whatsapp_number: settings.whatsapp_number,
      email: settings.email
    });
    return settings;
  },

  async seedDatabase(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    const write = async (ref: any, data: any) => {
      try {
        await setDoc(ref, data);
        success++;
      } catch (e) {
        failed++;
        console.warn("seed: falha ao escrever", ref.path, e);
      }
    };

    await write(doc(db, "settings", "homepage"), defaultHomepage);
    await write(doc(db, "settings", "about"), defaultAbout);
    await write(doc(db, "settings", "host"), defaultHost);
    await write(doc(db, "settings", "contacts"), defaultContacts);

    for (const acc of initialAccommodations) {
      await write(doc(db, "accommodations", acc.id), acc);
    }
    for (const img of initialImages) {
      await write(doc(db, "accommodation_images", img.id), img);
    }
    for (const am of initialAmenities) {
      await write(doc(db, "amenities", am.id), am);
    }

    return { success, failed };
  }
};
