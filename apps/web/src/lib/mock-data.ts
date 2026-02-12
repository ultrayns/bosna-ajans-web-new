/**
 * Mock data for sections - BOSNAAJANS real data with actual images
 */

export const mockSiteSettings = {
  brandName: 'BOSNA AJANS',
  tagline: 'Çekim ve Prodüksiyon Hizmeti',
  contactEmail: 'info@bosnaajans.com',
  contactPhone: '+90 532 XXX XX XX',
  address: 'İstanbul, Türkiye',
  socialInstagram: 'https://instagram.com/bosnaajans',
  socialVimeo: 'https://vimeo.com/bosnaajans',
  socialBehance: 'https://behance.net/bosnaajans',
  socialLinkedin: 'https://linkedin.com/company/bosnaajans',
};

export const mockHeroShowreel = {
  headline: 'Markanızı görsel hikayelerle hayata geçiriyoruz.',
  subline: 'İstanbul merkezli profesyonel prodüksiyon stüdyosu',
  ctaPrimaryLabel: 'Projelerimiz',
  ctaPrimaryUrl: '/portfolio',
  ctaSecondaryLabel: 'İletişime Geç',
  ctaSecondaryUrl: '/contact',
  // Hero background images - from real portfolio
  backgroundImages: [
    '/media/projects/genel/1-143.jpg',
    '/media/projects/genel/canta-urun-cekimi-3.jpg',
    '/media/projects/genel/1-8.jpg',
    '/media/projects/genel/z-4-1.jpg',
  ],
};

export const mockFeaturedProjects = [
  {
    id: '1',
    title: 'Kurumsal Tanıtım Filmi',
    slug: 'kurumsal-tanitim-filmi',
    client: { name: 'TTS Group' },
    year: 2025,
    categories: [{ name: 'Video Prodüksiyon', slug: 'video-production' }],
    heroPoster: '/media/projects/genel/43-1.jpg',
    video: '/media/videos/video-production.mp4',
    shortIntro: 'Profesyonel kurumsal tanıtım filmi prodüksiyonu.',
  },
  {
    id: '2',
    title: 'Moda Lookbook Çekimi',
    slug: 'moda-lookbook-cekimi',
    client: { name: 'Fashion Brand' },
    year: 2025,
    categories: [{ name: 'Moda Fotoğrafçılığı', slug: 'fashion-photography' }],
    heroPoster: '/media/projects/genel/IMG_3271-Edit-copy.jpg',
    video: '/media/videos/fashion-photography.mp4',
    shortIntro: 'Sezon koleksiyonu için profesyonel lookbook çekimi.',
  },
  {
    id: '3',
    title: 'E-Ticaret Ürün Çekimi',
    slug: 'eticaret-urun-cekimi',
    client: { name: 'E-Commerce Client' },
    year: 2025,
    categories: [{ name: 'Ürün Fotoğrafçılığı', slug: 'product-photography' }],
    heroPoster: '/media/projects/genel/urun-cekimi-1-2.jpg',
    video: '/media/videos/product-photography.mp4',
    shortIntro: 'E-ticaret platformları için profesyonel ürün fotoğrafçılığı.',
  },
  {
    id: '4',
    title: 'Lüks Takı Koleksiyonu',
    slug: 'luks-taki-koleksiyonu',
    client: { name: 'Jewelry Brand' },
    year: 2025,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    heroPoster: '/media/projects/genel/z-4-1.jpg',
    shortIntro: 'İnce detaylı mücevher fotoğrafçılığı.',
  },
  {
    id: '5',
    title: 'Stüdyo Katalog Çekimi',
    slug: 'studyo-katalog-cekimi',
    client: { name: 'Textile Brand' },
    year: 2025,
    categories: [{ name: 'Moda Çekim', slug: 'moda' }],
    heroPoster: '/media/projects/genel/1-8.jpg',
    shortIntro: 'Stüdyoda profesyonel katalog ve lookbook çekimi.',
  },
  {
    id: '6',
    title: 'Premium Zuccaciye Çekimi',
    slug: 'premium-zuccaciye-cekimi',
    client: { name: 'Kitchenware Brand' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/urun-zuccaciye-cekimi-17.jpg',
    video: '/media/videos/post-production.mp4',
    shortIntro: 'Mutfak ürünleri için premium fotoğraf çekimi.',
  },
];

export const mockCapabilities = [
  {
    title: 'Video Prodüksiyon',
    description: 'Tanıtım filmi, reklam ve sosyal medya içerik üretimi.',
    image: '/media/projects/genel/43-1.jpg',
    video: '/media/videos/video-production.mp4',
    slug: 'video-production',
  },
  {
    title: 'Fotoğraf Çekimi',
    description: 'Ürün, moda, yemek ve takı fotoğrafçılığında uzman kadro.',
    image: '/media/projects/genel/IMG_3271-Edit-copy.jpg',
    video: '/media/videos/fashion-photography.mp4',
    slug: 'fashion-photography',
  },
  {
    title: 'Ürün Fotoğrafçılığı',
    description: 'E-ticaret ve kataloglar için profesyonel ürün çekimi.',
    image: '/media/projects/genel/urun-cekimi-1-2.jpg',
    video: '/media/videos/product-photography.mp4',
    slug: 'product-photography',
  },
  {
    title: 'Post Prodüksiyon',
    description: 'Renk düzeltme, retouch ve profesyonel düzenleme hizmetleri.',
    image: '/media/projects/genel/1-32-2.jpg',
    video: '/media/videos/post-production.mp4',
    slug: 'post-production',
  },
];

export const mockManifesto = {
  content: `<p>Görsel hikaye anlatımının gücüne inanıyoruz. Markaları dönüştüren ve izleyicileri etkileyen içerikler üretiyoruz.</p>
  <p>Her proje ikonik bir şey yaratmak için bir fırsattır - sadece dikkat çekmeyen, onu komuta eden işler.</p>
  <p>Yaklaşımımız, editoryal hassasiyeti sinematik hırsla birleştirerek, aşırı doymuş bir dünyada öne çıkan içerikler sunar.</p>`,
  linkLabel: 'Hakkımızda',
  linkUrl: '/about',
  // Background image for manifesto section
  backgroundImage: '/media/projects/genel/Elektronik-urun-cekimi-1.jpg',
};

export const mockClients = [
  { name: 'Decathlon', logo: '/media/clients/decathlon.svg' },
  { name: 'Tekiş Makine', logo: '/media/clients/tekis.svg' },
  { name: 'Artstone', logo: '/media/clients/artstone.svg' },
  { name: 'Lacoste', logo: '/media/clients/lacoste.svg' },
  { name: 'Robin Clinic', logo: '/media/clients/robin.svg' },
  { name: 'Fashion Brand', logo: '/media/clients/fashion.svg' },
];

export const mockAwards = [
  { title: 'En İyi Kurumsal Film', year: 2024, type: 'award' as const },
  { title: 'Moda Fotoğrafçılığı Ödülü', year: 2024, type: 'award' as const },
  { title: 'Marketing Türkiye Röportaj', year: 2023, type: 'press' as const },
  { title: 'Yılın En İyi Stüdyosu', year: 2023, type: 'award' as const },
];

export const mockProcessSteps = [
  { title: 'Keşif', description: 'Marka, hedefler ve kitleyi anlama' },
  { title: 'Konsept', description: 'Yaratıcı vizyon ve hikaye geliştirme' },
  { title: 'Prodüksiyon', description: 'Vizyonu hassasiyetle hayata geçirme' },
  { title: 'Teslimat', description: 'Etki yaratmaya hazır profesyonel içerik' },
];

export const mockTeamMembers = [
  { name: 'Ahmet Yılmaz', role: 'Kreatif Direktör', photo: '/media/projects/genel/1-143.jpg' },
  { name: 'Elif Kaya', role: 'Prodüktör', photo: '/media/projects/genel/canta-urun-cekimi-3.jpg' },
  { name: 'Can Demir', role: 'Görüntü Yönetmeni', photo: '/media/projects/genel/1-8.jpg' },
  { name: 'Zeynep Arslan', role: 'Post Prodüksiyon Sorumlusu', photo: '/media/projects/genel/z-4-1.jpg' },
];

export const mockCTAFooter = {
  headline: 'Birlikte ikonik bir şeyler yaratalım.',
  showContactForm: true,
  showEmail: true,
  showSocials: true,
};

// Homepage sections configuration
export const mockHomepageSections = [
  { __component: 'sections.hero-showreel', ...mockHeroShowreel },
  { __component: 'sections.featured-works', title: 'Seçili İşler', projects: mockFeaturedProjects },
  { __component: 'sections.capabilities', title: 'Hizmetlerimiz', items: mockCapabilities },
  { __component: 'sections.manifesto', ...mockManifesto },
  { __component: 'sections.clients-logos', title: 'Güvenilir Markalar', clients: mockClients },
  { __component: 'sections.awards-press', title: 'Başarılarımız', awards: mockAwards },
  { __component: 'sections.process', title: 'Sürecimiz', steps: mockProcessSteps },
  { __component: 'sections.studio-team', title: 'Ekibimiz', teamMembers: mockTeamMembers },
  { __component: 'sections.cta-footer', ...mockCTAFooter },
];
