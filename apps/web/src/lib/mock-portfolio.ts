/**
 * Mock portfolio data - Real images from BOSNAAJANS
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: { name: string };
  year: number;
  categories: { name: string; slug: string }[];
  subcategories?: { name: string; slug: string }[];
  tags?: { name: string; slug: string }[];
  services?: { name: string; slug: string }[];
  heroPoster: string;
  heroVideo?: string;
  heroVideoPreview?: string;
  shortIntro: string;
  isFeatured: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

// Real categories from bosnaajans.com
export const mockCategories: Category[] = [
  { name: 'Tümü', slug: 'all', count: 25 },
  { name: 'Ürün Çekimi', slug: 'urun', count: 8 },
  { name: 'Züccaciye', slug: 'zuccaciye', count: 4 },
  { name: 'Takı Çekimi', slug: 'taki', count: 3 },
  { name: 'Saat Çekimi', slug: 'saat', count: 3 },
  { name: 'Moda Çekim', slug: 'moda', count: 2 },
  { name: 'Yemek Çekimi', slug: 'yemek', count: 2 },
  { name: 'Video Çekimi', slug: 'video', count: 2 },
  { name: 'Event', slug: 'event', count: 1 },
  { name: 'Kongre', slug: 'kongre', count: 1 },
];

// Züccaciye subcategories
export interface Subcategory {
  name: string;
  slug: string;
  parentSlug: string;
}

export const mockSubcategories: Subcategory[] = [
  { name: 'Baharatlık', slug: 'baharatlik', parentSlug: 'zuccaciye' },
  { name: 'Banyo Takımı', slug: 'banyo-takimi', parentSlug: 'zuccaciye' },
];

export const mockYears = [2025, 2024, 2023, 2022];

export const mockProjects: Project[] = [
  // ÜRÜN ÇEKİMİ
  {
    id: '1',
    title: 'Ayakkabı Çekimi',
    slug: 'ayakkabi-cekimi',
    client: { name: 'Ayakkabı Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/1-143.jpg',
    heroVideoPreview: '/media/videos/product-photography.mp4',
    shortIntro: 'Profesyonel ayakkabı ürün fotoğrafçılığı.',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Çanta Çekimi',
    slug: 'canta-cekimi',
    client: { name: 'Çanta Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/canta-urun-cekimi-3.jpg',
    heroVideoPreview: '/media/videos/product-photography.mp4',
    shortIntro: 'Lüks çanta ürün fotoğrafçılığı.',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Elektronik Ürün Çekimi',
    slug: 'elektronik-urun-cekimi',
    client: { name: 'Elektronik Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/Elektronik-urun-cekimi-1.jpg',
    shortIntro: 'Profesyonel elektronik ürün fotoğrafçılığı.',
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Gözlük Çekimi',
    slug: 'gozluk-cekimi',
    client: { name: 'Optik Mağazası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/1-1.jpg',
    shortIntro: 'Gözlük ve optik ürün fotoğrafçılığı.',
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Kemer Çekimi',
    slug: 'kemer-cekimi',
    client: { name: 'Deri Ürünler' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/z-5.jpg',
    shortIntro: 'Deri kemer ve aksesuar fotoğrafçılığı.',
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Kozmetik Çekimi',
    slug: 'kozmetik-cekimi',
    client: { name: 'Kozmetik Markası' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/4-6.jpg',
    shortIntro: 'Kozmetik ve güzellik ürünleri fotoğrafçılığı.',
    isFeatured: false,
  },
  {
    id: '7',
    title: 'İş Güvenliği Ekipmanları',
    slug: 'is-guvenligi-ekipmanlari',
    client: { name: 'İş Güvenliği Firması' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/urun-cekimi-1-2.jpg',
    shortIntro: 'İş güvenliği ekipmanları ürün çekimi.',
    isFeatured: false,
  },
  {
    id: '8',
    title: 'Cam Ürün Çekimi',
    slug: 'cam-urun-cekimi',
    client: { name: 'Cam Üreticisi' },
    year: 2025,
    categories: [{ name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/urun-cam-cekimi-1.jpg',
    shortIntro: 'Parlayan cam ürünlerin profesyonel çekimi.',
    isFeatured: false,
  },

  // ZÜCCACİYE
  {
    id: '9',
    title: 'Bardak Çekimi',
    slug: 'bardak-cekimi',
    client: { name: 'Züccaciye Markası' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/urun-zuccaciye-cekimi-17.jpg',
    heroVideoPreview: '/media/videos/product-photography.mp4',
    shortIntro: 'Bardak ve içecek aksesuarları çekimi.',
    isFeatured: true,
  },
  {
    id: '10',
    title: 'Kase Çekimi',
    slug: 'kase-cekimi',
    client: { name: 'Mutfak Ürünleri' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/IMG_2635-Edit-insta-.jpg',
    shortIntro: 'Kase ve servis tabakları çekimi.',
    isFeatured: false,
  },
  {
    id: '11',
    title: 'Kesme Tahtası Çekimi',
    slug: 'kesme-tahtasi',
    client: { name: 'Mutfak Gereçleri' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/IMG_8882-copy.jpg',
    shortIntro: 'Ahşap kesme tahtası ve mutfak aksesuarları.',
    isFeatured: false,
  },
  {
    id: '12',
    title: 'Kek Kalıbı Çekimi',
    slug: 'kek-kalibi',
    client: { name: 'Pasta Malzemeleri' },
    year: 2025,
    categories: [{ name: 'Züccaciye', slug: 'zuccaciye' }, { name: 'Ürün Çekimi', slug: 'urun' }],
    heroPoster: '/media/projects/genel/P_MTF-900199_8.jpg',
    shortIntro: 'Pasta ve kek kalıpları ürün çekimi.',
    isFeatured: false,
  },

  // TAKI ÇEKİMİ
  {
    id: '13',
    title: 'Konsept Takı Çekimi',
    slug: 'konsept-taki-cekimi',
    client: { name: 'Kuyumcu' },
    year: 2025,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    heroPoster: '/media/projects/genel/z-4-1.jpg',
    shortIntro: 'Konsept takı ve mücevher fotoğrafçılığı.',
    isFeatured: true,
  },
  {
    id: '14',
    title: 'Saat Çekimi',
    slug: 'saat-cekimi',
    client: { name: 'Saat Markası' },
    year: 2025,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    heroPoster: '/media/projects/genel/saat-cekimi-1-1.jpg',
    shortIntro: 'Lüks saat ve aksesuar fotoğrafçılığı.',
    isFeatured: false,
  },
  {
    id: '14b',
    title: 'Lüks Saat Koleksiyonu',
    slug: 'luks-saat-koleksiyonu',
    client: { name: 'Lüks Saat Markası' },
    year: 2024,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    heroPoster: '/media/projects/genel/saat-cekimi-1-34.jpg',
    shortIntro: 'Premium saat koleksiyonu fotoğraf çekimi.',
    isFeatured: false,
  },
  {
    id: '14c',
    title: 'Altın Saat Serisi',
    slug: 'altin-saat-serisi',
    client: { name: 'Saat Boutique' },
    year: 2024,
    categories: [{ name: 'Takı Çekimi', slug: 'taki' }],
    heroPoster: '/media/projects/genel/saat-cekimi-1-35.jpg',
    shortIntro: 'Özel altın saat çekimleri.',
    isFeatured: false,
  },

  // MODA ÇEKİM
  {
    id: '15',
    title: 'Ghost Hayalet Manken',
    slug: 'ghost-hayalet-manken',
    client: { name: 'Tekstil Firması' },
    year: 2025,
    categories: [{ name: 'Moda Çekim', slug: 'moda' }],
    heroPoster: '/media/projects/genel/1-32-2.jpg',
    heroVideoPreview: '/media/videos/fashion-photography.mp4',
    shortIntro: 'Ghost/hayalet manken kıyafet çekimi.',
    isFeatured: true,
  },
  {
    id: '16',
    title: 'Stüdyo Katalog Çekimi',
    slug: 'studyo-katalog-cekimi',
    client: { name: 'Moda Markası' },
    year: 2025,
    categories: [{ name: 'Moda Çekim', slug: 'moda' }],
    heroPoster: '/media/projects/genel/1-8.jpg',
    heroVideoPreview: '/media/videos/fashion-photography.mp4',
    shortIntro: 'Stüdyoda profesyonel katalog çekimi.',
    isFeatured: false,
  },
  {
    id: '16b',
    title: 'Çorap Koleksiyonu',
    slug: 'corap-koleksiyonu',
    client: { name: 'Tekstil Üreticisi' },
    year: 2024,
    categories: [{ name: 'Moda Çekim', slug: 'moda' }],
    heroPoster: '/media/projects/genel/corap-cekimi-1.jpg',
    shortIntro: 'Çorap ve tekstil ürünleri çekimi.',
    isFeatured: false,
  },

  // YEMEK ÇEKİMİ
  {
    id: '17',
    title: 'Kebap Çekimi',
    slug: 'kebap-cekimi',
    client: { name: 'Kebap Restoranı' },
    year: 2025,
    categories: [{ name: 'Yemek Çekimi', slug: 'yemek' }],
    heroPoster: '/media/projects/genel/1-16-1.jpg',
    shortIntro: 'Geleneksel Türk mutfağı yemek fotoğrafçılığı.',
    isFeatured: true,
  },
  {
    id: '18',
    title: 'Fast Food Çekimi',
    slug: 'fast-food-cekimi',
    client: { name: 'Fast Food Zinciri' },
    year: 2025,
    categories: [{ name: 'Yemek Çekimi', slug: 'yemek' }],
    heroPoster: '/media/projects/genel/1-7.jpg',
    shortIntro: 'Hamburger ve fast food menü çekimi.',
    isFeatured: false,
  },
  {
    id: '18b',
    title: 'Gurme Yemek Çekimi',
    slug: 'gurme-yemek-cekimi',
    client: { name: 'Fine Dining Restoran' },
    year: 2024,
    categories: [{ name: 'Yemek Çekimi', slug: 'yemek' }],
    heroPoster: '/media/projects/genel/IMG_6085-Edit-.jpg',
    shortIntro: 'Gurme mutfak ve fine dining fotoğrafçılığı.',
    isFeatured: false,
  },

  // EVENT
  {
    id: '19',
    title: 'Event Çekimi',
    slug: 'event-cekimi',
    client: { name: 'Etkinlik Ajansı' },
    year: 2025,
    categories: [{ name: 'Event', slug: 'event' }],
    heroPoster: '/media/projects/genel/43-1.jpg',
    shortIntro: 'Kurumsal etkinlik ve lansman çekimleri.',
    isFeatured: false,
  },

  // KONGRE
  {
    id: '20',
    title: 'Kongre Çekimi',
    slug: 'kongre-cekimi',
    client: { name: 'Kongre Merkezi' },
    year: 2025,
    categories: [{ name: 'Kongre', slug: 'kongre' }],
    heroPoster: '/media/projects/genel/16-3.jpg',
    shortIntro: 'Profesyonel kongre ve konferans çekimi.',
    isFeatured: false,
  },
];
