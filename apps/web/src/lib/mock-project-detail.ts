/**
 * Mock project detail data - BOSNAAJANS real projects with actual images
 */

export interface BlockType {
  __component: string;
  [key: string]: unknown;
}

export interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  client: { name: string };
  year: number;
  categories: { name: string; slug: string }[];
  services?: { name: string }[];
  heroVideo?: string;
  heroPoster: string;
  shortIntro: string;
  fullDescription?: string;
  credits?: { role: string; name: string }[];
  blocks: BlockType[];
  relatedProjects?: string[];
}

export const mockProjectDetails: Record<string, ProjectDetail> = {
  // ÜRÜN ÇEKİMİ
  'ayakkabi-cekimi': {
    id: '1',
    title: 'Ayakkabı Çekimi',
    slug: 'ayakkabi-cekimi',
    client: { name: 'Ayakkabı Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/1-143.jpg',
    shortIntro: 'Profesyonel ayakkabı ürün fotoğrafçılığı.',
    fullDescription: 'E-ticaret ve katalog için profesyonel ayakkabı çekimi. Ürünlerin detayları, dokusu ve renkleri en iyi şekilde yansıtıldı.',
    credits: [
      { role: 'Fotoğrafçı', name: 'BOSNA AJANS' },
    ],
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/1-143.jpg', alt: 'Ayakkabı 1' },
          { url: '/media/projects/genel/1-1.jpg', alt: 'Ayakkabı 2' },
        ],
      },
      {
        __component: 'blocks.text-block',
        content: '<p>Ayakkabı fotoğrafçılığında ışık ve açı, ürünün karakterini ortaya çıkaran en önemli unsurlardır.</p>',
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['canta-cekimi', 'kemer-cekimi'],
  },
  'canta-cekimi': {
    id: '2',
    title: 'Çanta Çekimi',
    slug: 'canta-cekimi',
    client: { name: 'Çanta Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/canta-urun-cekimi-3.jpg',
    shortIntro: 'Lüks çanta ürün fotoğrafçılığı.',
    fullDescription: 'Premium çanta koleksiyonunun e-ticaret ve sosyal medya için profesyonel çekimi.',
    credits: [
      { role: 'Fotoğrafçı', name: 'BOSNA AJANS' },
    ],
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/canta-urun-cekimi-3.jpg', alt: 'Çanta 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['ayakkabi-cekimi', 'kemer-cekimi'],
  },
  'elektronik-urun-cekimi': {
    id: '3',
    title: 'Elektronik Ürün Çekimi',
    slug: 'elektronik-urun-cekimi',
    client: { name: 'Elektronik Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/Elektronik-urun-cekimi-1.jpg',
    shortIntro: 'Profesyonel elektronik ürün fotoğrafçılığı.',
    fullDescription: 'Elektronik ürünlerin teknik detaylarını ve tasarımını ön plana çıkaran profesyonel çekimler.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/Elektronik-urun-cekimi-1.jpg', alt: 'Elektronik 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['cam-urun-cekimi'],
  },
  'gozluk-cekimi': {
    id: '4',
    title: 'Gözlük Çekimi',
    slug: 'gozluk-cekimi',
    client: { name: 'Optik Mağazası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/1-1.jpg',
    shortIntro: 'Gözlük ve optik ürün fotoğrafçılığı.',
    fullDescription: 'Gözlük ve optik ürünlerin yansıma kontrolüyle profesyonel çekimi.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/1-1.jpg', alt: 'Gözlük 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['kozmetik-cekimi'],
  },
  'kemer-cekimi': {
    id: '5',
    title: 'Kemer Çekimi',
    slug: 'kemer-cekimi',
    client: { name: 'Deri Ürünler' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/z-5.jpg',
    shortIntro: 'Deri kemer ve aksesuar fotoğrafçılığı.',
    fullDescription: 'Deri ürünlerin doku ve kalitesini yansıtan profesyonel çekimler.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/z-5.jpg', alt: 'Kemer 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['ayakkabi-cekimi', 'canta-cekimi'],
  },
  'kozmetik-cekimi': {
    id: '6',
    title: 'Kozmetik Çekimi',
    slug: 'kozmetik-cekimi',
    client: { name: 'Kozmetik Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/4-6.jpg',
    shortIntro: 'Kozmetik ve güzellik ürünleri fotoğrafçılığı.',
    fullDescription: 'Kozmetik ürünlerin şıklığını ve kalitesini yansıtan profesyonel çekimler.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/4-6.jpg', alt: 'Kozmetik 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['gozluk-cekimi'],
  },
  'is-guvenligi-ekipmanlari': {
    id: '7',
    title: 'İş Güvenliği Ekipmanları',
    slug: 'is-guvenligi-ekipmanlari',
    client: { name: 'İş Güvenliği Firması' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/urun-cekimi-1-2.jpg',
    shortIntro: 'İş güvenliği ekipmanları ürün çekimi.',
    fullDescription: 'İş güvenliği ürünlerinin profesyonel katalog ve e-ticaret çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/urun-cekimi-1-2.jpg', alt: 'Ekipman 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['elektronik-urun-cekimi'],
  },
  'cam-urun-cekimi': {
    id: '8',
    title: 'Cam Ürün Çekimi',
    slug: 'cam-urun-cekimi',
    client: { name: 'Cam Üreticisi' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/urun-cam-cekimi-1.jpg',
    shortIntro: 'Parlayan cam ürünlerin profesyonel çekimi.',
    fullDescription: 'Cam ve parlak yüzeyli ürünlerin yansıma kontrolüyle profesyonel çekimi.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/urun-cam-cekimi-1.jpg', alt: 'Cam ürün 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['bardak-cekimi'],
  },
  
  // ZÜCCACİYE
  'bardak-cekimi': {
    id: '9',
    title: 'Bardak Çekimi',
    slug: 'bardak-cekimi',
    client: { name: 'Züccaciye Markası' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/urun-zuccaciye-cekimi-17.jpg',
    shortIntro: 'Bardak ve içecek aksesuarları çekimi.',
    fullDescription: 'Züccaciye ürünlerinin profesyonel katalog ve e-ticaret çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/urun-zuccaciye-cekimi-17.jpg', alt: 'Bardak 1' },
          { url: '/media/projects/genel/zuccaciye-urun-cekimi-28.jpg', alt: 'Bardak 2' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['kase-cekimi', 'kesme-tahtasi'],
  },
  'kase-cekimi': {
    id: '10',
    title: 'Kase Çekimi',
    slug: 'kase-cekimi',
    client: { name: 'Mutfak Ürünleri' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/IMG_2635-Edit-insta-.jpg',
    shortIntro: 'Kase ve servis tabakları çekimi.',
    fullDescription: 'Mutfak ürünlerinin profesyonel çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/IMG_2635-Edit-insta-.jpg', alt: 'Kase 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['bardak-cekimi', 'kesme-tahtasi'],
  },
  'kesme-tahtasi': {
    id: '11',
    title: 'Kesme Tahtası Çekimi',
    slug: 'kesme-tahtasi',
    client: { name: 'Mutfak Gereçleri' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/IMG_8882-copy.jpg',
    shortIntro: 'Ahşap kesme tahtası ve mutfak aksesuarları.',
    fullDescription: 'Ahşap mutfak ürünlerinin doku ve kalitesini yansıtan çekimler.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/IMG_8882-copy.jpg', alt: 'Kesme tahtası 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['bardak-cekimi', 'kase-cekimi'],
  },
  'kek-kalibi': {
    id: '12',
    title: 'Kek Kalıbı Çekimi',
    slug: 'kek-kalibi',
    client: { name: 'Pasta Malzemeleri' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/P_MTF-900199_8.jpg',
    shortIntro: 'Pasta ve kek kalıpları ürün çekimi.',
    fullDescription: 'Mutfak araç gereçlerinin profesyonel çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/P_MTF-900199_8.jpg', alt: 'Kek kalıbı 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['bardak-cekimi'],
  },
  
  // TAKI ÇEKİMİ
  'konsept-taki-cekimi': {
    id: '13',
    title: 'Konsept Takı Çekimi',
    slug: 'konsept-taki-cekimi',
    client: { name: 'Kuyumcu' },
    year: 2025,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/z-4-1.jpg',
    shortIntro: 'Konsept takı ve mücevher fotoğrafçılığı.',
    fullDescription: 'Takı ve mücevherlerin parlaklığını ve detaylarını ön plana çıkaran profesyonel çekimler.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/z-4-1.jpg', alt: 'Takı 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['saat-cekimi'],
  },
  'saat-cekimi': {
    id: '14',
    title: 'Saat Çekimi',
    slug: 'saat-cekimi',
    client: { name: 'Saat Markası' },
    year: 2025,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    services: [{ name: 'Ürün Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/saat-cekimi-1-1.jpg',
    shortIntro: 'Lüks saat ve aksesuar fotoğrafçılığı.',
    fullDescription: 'Saat koleksiyonlarının profesyonel katalog çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 3,
        gap: 'small',
        images: [
          { url: '/media/projects/genel/saat-cekimi-1-1.jpg', alt: 'Saat 1' },
          { url: '/media/projects/genel/saat-cekimi-1-34.jpg', alt: 'Saat 2' },
          { url: '/media/projects/genel/saat-cekimi-1-35.jpg', alt: 'Saat 3' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['konsept-taki-cekimi'],
  },
  
  // MODA ÇEKİM
  'ghost-hayalet-manken': {
    id: '15',
    title: 'Ghost Hayalet Manken',
    slug: 'ghost-hayalet-manken',
    client: { name: 'Tekstil Firması' },
    year: 2025,
    categories: [{ name: 'Moda Çekim', slug: 'moda' }],
    services: [{ name: 'Moda Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/1-32-2.jpg',
    shortIntro: 'Ghost/hayalet manken kıyafet çekimi.',
    fullDescription: 'E-ticaret için hayalet manken tekniğiyle profesyonel kıyafet çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/1-32-2.jpg', alt: 'Ghost 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['studyo-katalog-cekimi'],
  },
  'studyo-katalog-cekimi': {
    id: '16',
    title: 'Stüdyo Katalog Çekimi',
    slug: 'studyo-katalog-cekimi',
    client: { name: 'Moda Markası' },
    year: 2025,
    categories: [{ name: 'Moda Çekim', slug: 'moda' }],
    services: [{ name: 'Moda Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/1-8.jpg',
    shortIntro: 'Stüdyoda profesyonel katalog çekimi.',
    fullDescription: 'Moda ürünlerinin stüdyo ortamında profesyonel katalog çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/1-8.jpg', alt: 'Katalog 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['ghost-hayalet-manken'],
  },
  
  // YEMEK ÇEKİMİ
  'kebap-cekimi': {
    id: '17',
    title: 'Kebap Çekimi',
    slug: 'kebap-cekimi',
    client: { name: 'Kebap Restoranı' },
    year: 2025,
    categories: [{ name: 'Yemek Çekimi', slug: 'yemek' }],
    services: [{ name: 'Yemek Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/1-16-1.jpg',
    shortIntro: 'Geleneksel Türk mutfağı yemek fotoğrafçılığı.',
    fullDescription: 'Kebap ve geleneksel Türk yemeklerinin iştah açıcı profesyonel çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/1-16-1.jpg', alt: 'Kebap 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['fast-food-cekimi'],
  },
  'fast-food-cekimi': {
    id: '18',
    title: 'Fast Food Çekimi',
    slug: 'fast-food-cekimi',
    client: { name: 'Fast Food Zinciri' },
    year: 2025,
    categories: [{ name: 'Yemek Çekimi', slug: 'yemek' }],
    services: [{ name: 'Yemek Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/1-7.jpg',
    shortIntro: 'Hamburger ve fast food menü çekimi.',
    fullDescription: 'Fast food ürünlerinin iştah açıcı profesyonel çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/1-7.jpg', alt: 'Fast food 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['kebap-cekimi'],
  },
  
  // EVENT
  'event-cekimi': {
    id: '19',
    title: 'Event Çekimi',
    slug: 'event-cekimi',
    client: { name: 'Etkinlik Ajansı' },
    year: 2025,
    categories: [{ name: 'Event', slug: 'event' }],
    services: [{ name: 'Etkinlik Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/43-1.jpg',
    shortIntro: 'Kurumsal etkinlik ve lansman çekimleri.',
    fullDescription: 'Kurumsal etkinlik, lansman ve organizasyonların profesyonel çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/43-1.jpg', alt: 'Event 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['kongre-cekimi'],
  },
  
  // KONGRE
  'kongre-cekimi': {
    id: '20',
    title: 'Kongre Çekimi',
    slug: 'kongre-cekimi',
    client: { name: 'Kongre Merkezi' },
    year: 2025,
    categories: [{ name: 'Kongre', slug: 'kongre' }],
    services: [{ name: 'Etkinlik Fotoğrafçılığı' }],
    heroPoster: '/media/projects/genel/16-3.jpg',
    shortIntro: 'Profesyonel kongre ve konferans çekimi.',
    fullDescription: 'Kongre, konferans ve seminer etkinliklerinin profesyonel çekimleri.',
    blocks: [
      {
        __component: 'blocks.gallery-block',
        columns: 2,
        gap: 'medium',
        images: [
          { url: '/media/projects/genel/16-3.jpg', alt: 'Kongre 1' },
        ],
      },
      { __component: 'blocks.credits-block' },
    ],
    relatedProjects: ['event-cekimi'],
  },
};

export function getProjectBySlug(slug: string): ProjectDetail | null {
  return mockProjectDetails[slug] || null;
}

export function getRelatedProjects(slugs: string[]): ProjectDetail[] {
  return slugs
    .map((slug) => mockProjectDetails[slug])
    .filter((project): project is ProjectDetail => project !== undefined);
}
