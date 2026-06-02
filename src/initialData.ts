import { Accommodation, AccommodationImage, Amenity, Host, Settings } from "./types";

export const initialHost: Host = {
  id: "host-1",
  name: "António Enclave",
  photo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYE1ZY8w9_dj9OARYmF1NLXNizhShKsMICFQ5EbGcXFfI4g7Yv1uJax-c0114B3dQxvNH9dgRenGeKunc0gSiM-tOevfNVkQNXBR_hTgqsPksX0sfNQx9LfIPTz4skoiXndip-0OkvboPRjVMfTSXmmKhd6dx3FfqEn2QPQhFC1YTub7wR624NFSoxAXyvka8xvaN7kzMF-XQDja35_FzVr6KmwxZQlQdgnLy4pr37mzudoqvKPKlSH8xh7u2WgpGqz5kuiNuML4U",
  bio: "Com mais de 10 anos de experiência no sector de hospitalidade em Moçambique e Zimbabwe, garanto que sua estadia nas acomodações da Enclave seja sinônimo de segurança, luxo e tranquilidade absoluta."
};

export const initialSettings: Settings = {
  id: "settings-1",
  company_name: "Enclave Accommodation",
  whatsapp_number: "+26377735000",
  email: "reservas@enclave.co.mz",
  about_text: "A Enclave Accommodation nasceu da paixão por transformar estadias em experiências memoráveis. Com sede estratégica em Chimoio e expansão para Mutare e Nyanga, oferecemos mais do que um quarto; entregamos um santuário curado, pautado na sofisticação, no minimalismo estético e no profissionalismo absoluto."
};

export const initialAccommodations: Accommodation[] = [
  {
    id: "acc-1",
    name: "Residência Vale dos Sonhos",
    city: "Chimoio",
    country: "Moçambique",
    description: "Descubra a combinação perfeita entre o design moderno e o conforto absoluto na Residência Vale dos Sonhos. Localizada numa zona privilegiada de Chimoio, esta propriedade oferece uma experiência de hospitalidade premium, ideal para famílias ou grupos que procuram um refúgio exclusivo. Com acabamentos de alta qualidade e uma arquitetura que valoriza a luz natural e a ventilação, cada detalhe foi curado para proporcionar uma estadia inesquecível.",
    price_per_night: 8500,
    bedrooms: 4,
    beds: 6,
    bathrooms: 3.5,
    max_guests: 8,
    google_maps_link: "https://maps.google.com/?q=Chimoio",
    whatsapp_number: "+26377735000"
  },
  {
    id: "acc-2",
    name: "Villa Chimoio Central",
    city: "Chimoio",
    country: "Moçambique",
    description: "Uma maravilhosa villa luxuosa no coração de Chimoio. Decorada com ornamentos dourados sublimes e acabamentos em madeira nobre. Oferece um retiro calmo com piscina privativa, jardins ensolarados e segurança total de alto padrão para quem exige sofisticação e discrição.",
    price_per_night: 8500,
    bedrooms: 3,
    beds: 5,
    bathrooms: 2,
    max_guests: 6,
    google_maps_link: "https://maps.google.com/?q=Chimoio+Central",
    whatsapp_number: "+26377735000"
  },
  {
    id: "acc-3",
    name: "Nyanga Peak Lodge",
    city: "Nyanga",
    country: "Zimbabwe",
    description: "Aninhado nos picos enevoados de Nyanga, este lodge de basalto escuro redefine a harmonia com a natureza. Com vistas deslumbrantes para o vale dos pinheiros e lareira central aconchegante, é o santuário perfeito para casais ou entusiastas de montanha.",
    price_per_night: 12000,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    max_guests: 4,
    google_maps_link: "https://maps.google.com/?q=Nyanga+Peak",
    whatsapp_number: "+258841112222"
  },
  {
    id: "acc-4",
    name: "Mutare Executive Suite",
    city: "Mutare",
    country: "Zimbabwe",
    description: "O epítome do conforto contemporâneo com texturas inspiradas no design Africano. Situado em um ambiente boutique exclusivo no centro de Mutare, oferece piscina refrescante, interiores em tons areia e atendimento personalizado com alto requinte profissional.",
    price_per_night: 6200,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    max_guests: 2,
    google_maps_link: "https://maps.google.com/?q=Mutare+Suite",
    whatsapp_number: "+258842223333"
  }
];

export const initialImages: AccommodationImage[] = [
  // Residência Vale dos Sonhos
  {
    id: "img-1-1",
    accommodation_id: "acc-1",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2NMAWRjTgSn8_z_gqw9BT7GCHY7ardIQ8vbM0x9C9bwQ06xOrw_Iop95YveELbK0kyoMRBrftbeNaCcub4UFdt9fHCXieiUOUAr6KSkTSsG7e06hk0dW-RrA1xqeGnzo5ioXctvUlX_Mn2GiBI9houB-XaBWXf8RDg8De3Dj3MqbBOE3vMu6Gh1HGCGK2ObnFJmfw3EprZZwtKZNUnEmLyjC29yoc3KRrydK2yiE2YijnwXyihMrIdWrAYqOdHghY72y0iPIvyZ4"
  },
  {
    id: "img-1-2",
    accommodation_id: "acc-1",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHwuelUS7CWpW0yPYfJhmstqX0xm0NNRaqxzV5w26ISzkmACMKxYW8xSk0eJoYJfxiJL5u7d4Ti8kMFsRovcg3_8UvhOo7WuPQUr8v97PyXFBh2qmrhBMTX3yGZjwmpHEpEPE_aU12O8Hzr1sxFlYdsBgWPxl-4k02_nqDAt2E2Z9iw7WshOld8KhitnB8XgiybSo4x-oYJGjyvRqVbhAtBqcV7UvS1ylgmKy_Dqm6VUZjllkCFYmrqBrHQRv3e7LPqhWIynBAhjM"
  },
  {
    id: "img-1-3",
    accommodation_id: "acc-1",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBX2a8hCev-TRqU7-b2CDMXkLM_7XtjW8jo2PtAKCs7_wgLPR-ZsFcCpjakWSd3Ew-5wZ2CFuSv9j0QZvbLqunfeFjkuenjHIFEGgN-SUUgt4Fe8z8RcAPt8byTMLgwg6kFJmOtA-dfZym32LPEKm_TL_FLV2JzVwZ848kF-GgvCtLR9kRNQeiiGIzeVpjxljrexC-LW-8_1nmIKFnByY-m3iBq8TwxqqMwZOBFqBSq2pyvwJTx7MYR4e_3z1plecd6KqlLH9hy18g"
  },
  {
    id: "img-1-4",
    accommodation_id: "acc-1",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn169pxcXFn8jhpn2w2-IcX9PUsk-rGwzaveziobu6YbTSJ5p6KPE3EJpZMshdqx4p613KWmzpXwIY1sc9x9xr-0r-EySWZdSV-CVXuetr4O0_7MufndpOhtzzTbiqz8Z64vj61KfZgC8INqCeuvp4J4xdEV6KcGr_WEtE5b83e0BkWlcpwqi7SwbNJTaGYxvEYV0kD06eHdRH7crCJteug4xombs__4b3VyYnhOQL5-ZKyOZaVro10Wnqm4FfQ9KP4G-gXpqnWns"
  },

  // Villa Chimoio Central
  {
    id: "img-2-1",
    accommodation_id: "acc-2",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnt-5WZ0ID_LlTCcvB9tPfkMvyjMATglf66XyO0cTYycyoizO_rNSJ2IkQRVHl7TMaxIrp3dd5rvVnHgL4ywOdJn_x3dQqXs2XB0H8MvI7GnsuKIkvMuRzYopoSU_sZfMHAyR4P_f4fEStn8hMzwrZsjPYItglYrt3MnPesDV1UIfOceQNCkz3INDWCxHmgxpoFlWw2eDvwtvAnTuR2EL9wrzW6YjARGOR9Z4PjjhbXv9QJ5pie67iON5bYtROL1a2OBBxr0CJD60"
  },

  // Nyanga Peak Lodge
  {
    id: "img-3-1",
    accommodation_id: "acc-3",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKwSPTsm-QZm9uBiZy3i7Ubo689eFzuGA3cGCToUpSRaT-AV4dQUqvUsRjw4ZQFP4EWU28ZD9qwl3Ed-cCFMo5p-K0eRQ5yy5A1UoL6UHkhWgshVNJyJMR9Tork4U89RtB2dOxFMMbNrQTuiwmoVHF9DkT0cmxTl43G-ulnsNl5JOttoU-Zx9qJxazE_0K7XKCOBVbhtPnJvlh_pBJwYZU-0j1AH1DTw1pzoaELiV2xUkkg-YpAuFslAVo1ZboJm5HpZyCnUW1zhE"
  },

  // Mutare Executive Suite
  {
    id: "img-4-1",
    accommodation_id: "acc-4",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYeKz-8aQt0T-8ycrDBQnbqdpb2QpK_G5UuJH3Pj4RrWsdHAEZCvhveXjduc0CQaHCd0DShMs7PW4Rvq8NGB7qEnXH8BH1FuIi1KsMmR1GDr8zLTV9uxQ9TLnEk99VzAPWJF8Q-r_wwxdQQJrYKx4dNEu42ViurIMU7MPTP7ITDWrHj7p2p-U17_L-plADWtPsNEY04h4kVD-SpQS69GzCVksAC3PSAOeHEkbycIwDmjI0gBa663egoy_jjvBrkcWpxFP7ATQbsCo"
  }
];

export const initialAmenities: Amenity[] = [
  // Residência Vale dos Sonhos
  { id: "am-1-1", accommodation_id: "acc-1", amenity_name: "Wi-Fi ultra-rápido" },
  { id: "am-1-2", accommodation_id: "acc-1", amenity_name: "Estacionamento Grátis" },
  { id: "am-1-3", accommodation_id: "acc-1", amenity_name: "Cozinha Equipada" },
  { id: "am-1-4", accommodation_id: "acc-1", amenity_name: "Água Quente" },
  { id: "am-1-5", accommodation_id: "acc-1", amenity_name: "Netflix & Smart TV" },
  { id: "am-1-6", accommodation_id: "acc-1", amenity_name: "Quintal Privado" },
  { id: "am-1-7", accommodation_id: "acc-1", amenity_name: "Vista Panorâmica" },
  { id: "am-1-8", accommodation_id: "acc-1", amenity_name: "Máquina de Lavar" },

  // Villa Chimoio Central
  { id: "am-2-1", accommodation_id: "acc-2", amenity_name: "Wi-Fi ultra-rápido" },
  { id: "am-2-2", accommodation_id: "acc-2", amenity_name: "Ar Condicionado" },
  { id: "am-2-3", accommodation_id: "acc-2", amenity_name: "Piscina Privada" },
  { id: "am-2-4", accommodation_id: "acc-2", amenity_name: "Segurança 24h" },

  // Nyanga Peak Lodge
  { id: "am-3-1", accommodation_id: "acc-3", amenity_name: "Lareira a Lenha" },
  { id: "am-3-2", accommodation_id: "acc-3", amenity_name: "Vista de Montanha" },
  { id: "am-3-3", accommodation_id: "acc-3", amenity_name: "Água Quente" },
  { id: "am-3-4", accommodation_id: "acc-3", amenity_name: "Estacionamento Grátis" },

  // Mutare Executive Suite
  { id: "am-4-1", accommodation_id: "acc-4", amenity_name: "Wi-Fi ultra-rápido" },
  { id: "am-4-2", accommodation_id: "acc-4", amenity_name: "Serviço de Quarto" },
  { id: "am-4-3", accommodation_id: "acc-4", amenity_name: "Cozinha Equipada" },
  { id: "am-4-4", accommodation_id: "acc-4", amenity_name: "Netflix & Smart TV" }
];
