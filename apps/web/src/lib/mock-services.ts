/**
 * Mock services data - BOSNAAJANS real services
 * Local data for services pages
 */

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  image?: string;
  video?: string;
  features?: string[];
  relatedProjects?: string[];
}

export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Video Prodüksiyon',
    slug: 'video-production',
    shortDescription: 'Tanıtım filmleri, reklam videoları ve sosyal medya içerikleri.',
    fullDescription: 'Konsept geliştirmeden son teslimata kadar tüm video prodüksiyon süreçlerini profesyonelce yönetiyoruz. Markanızın hikayesini görsel etkiyle anlatan yüksek kaliteli içerikler üretiyoruz.',
    image: '/media/projects/genel/43-1.jpg',
    video: '/media/videos/video-production.mp4',
    features: [
      'Tanıtım filmleri',
      'Reklam spotları',
      'Sosyal medya videoları',
      'Kurumsal filmler',
      'Ürün tanıtım videoları',
      'Etkinlik çekimleri',
    ],
    relatedProjects: ['tekis-makine', 'artstone-reklam', 'lacoste-dijital'],
  },
  {
    id: '2',
    title: 'Moda Fotoğrafçılığı',
    slug: 'fashion-photography',
    shortDescription: 'Markalar ve yayınlar için editoryal ve ticari moda fotoğrafçılığı.',
    fullDescription: 'Moda dünyasının dinamik yapısını profesyonel kadromuzla en iyi şekilde yansıtıyoruz. Lookbook çekimlerinden katalog fotoğrafçılığına, dış mekan çekimlerinden stüdyo prodüksiyonlarına kadar her türlü moda projesi için yanınızdayız.',
    image: '/media/projects/genel/IMG_3271-Edit-copy.jpg',
    video: '/media/videos/fashion-photography.mp4',
    features: [
      'Lookbook çekimleri',
      'Katalog fotoğrafçılığı',
      'Editöryal çekimler',
      'Dış mekan moda çekimi',
      'Ghost mannequin',
      'Model koordinasyonu',
    ],
    relatedProjects: ['moda-lookbook-ss24', 'ziver-koleksiyon'],
  },
  {
    id: '3',
    title: 'Ürün Fotoğrafçılığı',
    slug: 'product-photography',
    shortDescription: 'E-ticaret ve kataloglar için yüksek kaliteli ürün fotoğrafçılığı.',
    fullDescription: 'E-ticaret siteniz için yüksek dönüşüm sağlayan profesyonel ürün fotoğrafları. Beyaz zemin, lifestyle ve 360° çekimler dahil tüm e-ticaret görsel ihtiyaçlarınızı karşılıyoruz.',
    image: '/media/projects/genel/urun-cekimi-1-2.jpg',
    video: '/media/videos/product-photography.mp4',
    features: [
      'Beyaz zemin ürün çekimi',
      'Lifestyle/ambiyans çekimleri',
      '360° ürün fotoğrafları',
      'Paket & ambalaj çekimi',
      'Model üzeri ürün çekimi',
      'Hızlı teslimat',
    ],
    relatedProjects: ['ghost-mannequin', 'ayakkabi-katalog', 'canta-koleksiyon'],
  },
  {
    id: '4',
    title: 'Post Prodüksiyon',
    slug: 'post-production',
    shortDescription: 'Renk düzeltme, rötuş ve düzenleme hizmetleri.',
    fullDescription: 'Son teknoloji stüdyomuzda tüm içerikleriniz için dünya standartlarında post prodüksiyon hizmetleri sunuyoruz. İnce renk düzeltmeden karmaşık görsel efektlere kadar projenizin en iyi görünmesini sağlıyoruz.',
    image: '/media/projects/genel/1-32-2.jpg',
    video: '/media/videos/post-production.mp4',
    features: [
      'Renk grading & düzeltme',
      'Retouch & düzenleme',
      'Motion graphics',
      'Ses tasarımı & mix',
      'Video düzenleme',
      'Görsel efektler (VFX)',
    ],
    relatedProjects: ['tanitim-filmi', 'video-produksiyon'],
  },
  {
    id: '5',
    title: 'Etkinlik Çekimi',
    slug: 'event-photography',
    shortDescription: 'Kongre, lansman ve kurumsal etkinlik dokümantasyonu.',
    fullDescription: 'Önemli anlarınızı profesyonelce belgeleyen etkinlik çekimi hizmetleri. Kongrelerden lansmanлара, kurumsal toplantılardan özel etkinliklere kadar tüm organizasyonlarınız için kapsamlı dokümantasyon sağlıyoruz.',
    image: '/media/projects/genel/16-3.jpg',
    features: [
      'Kongre & konferans çekimi',
      'Ürün lansman etkinlikleri',
      'Kurumsal toplantılar',
      'Açılış törenleri',
      'Fuar çekimleri',
      'Canlı yayın desteği',
    ],
    relatedProjects: ['decathlon-event', 'istanbul-kongre', 'medikal-kongre'],
  },
  {
    id: '6',
    title: 'Kreatif Yönetmenlik',
    slug: 'creative-direction',
    shortDescription: 'Stratejik vizyon ile markaları kültürel hareketlere dönüştürme.',
    fullDescription: 'Kampanyalar ve marka girişimleri için uçtan uca kreatif yönetmenlik sağlıyoruz. Stratejik yaklaşımımız, her görsel unsurun marka kimliğiniz ve iş hedeflerinizle uyumlu olmasını garanti eder.',
    image: '/media/projects/genel/IMG_2635-Edit-insta-.jpg',
    features: [
      'Marka stratejisi',
      'Kampanya geliştirme',
      'Sanat yönetmenliği',
      'Konsept geliştirme',
      'Görsel kimlik sistemleri',
      'Sosyal medya stratejisi',
    ],
    relatedProjects: ['moda-lookbook-ss24', 'artstone-reklam'],
  },
  {
    id: '7',
    title: 'Web Yazılım & Tasarım',
    slug: 'web-development',
    shortDescription: 'Modern, hızlı ve mobil uyumlu web siteleri ve uygulamalar.',
    fullDescription: 'İşletmenizi dijital dünyada ön plana çıkaracak modern web çözümleri sunuyoruz. Kurumsal web sitelerinden e-ticaret platformlarına, özel yazılım çözümlerinden mobil uygulamalara kadar tüm dijital ihtiyaçlarınızı karşılıyoruz.',
    image: '/media/projects/genel/web-design.jpg',
    features: [
      'Kurumsal web sitesi tasarımı',
      'E-ticaret platformları',
      'Mobil uygulama geliştirme',
      'UI/UX tasarımı',
      'SEO optimizasyonu',
      'Web hosting & bakım',
    ],
    relatedProjects: ['tekis-makine', 'artstone-reklam'],
  },
  {
    id: '8',
    title: 'Dijital Marketing',
    slug: 'digital-marketing',
    shortDescription: 'Markanızı büyütecek kapsamlı dijital pazarlama stratejileri.',
    fullDescription: 'Veri odaklı dijital pazarlama stratejileriyle markanızı hedef kitlenize ulaştırıyoruz. SEO, içerik pazarlaması, e-posta marketing ve performans pazarlaması ile sürdürülebilir büyüme sağlıyoruz.',
    image: '/media/projects/genel/digital-marketing.jpg',
    features: [
      'SEO & SEM stratejileri',
      'İçerik pazarlaması',
      'E-posta marketing',
      'Influencer marketing',
      'Analitik & raporlama',
      'Dönüşüm optimizasyonu',
    ],
    relatedProjects: ['lacoste-dijital', 'artstone-reklam'],
  },
  {
    id: '9',
    title: 'Reklam Yönetimi',
    slug: 'advertising-management',
    shortDescription: 'Google Ads, Meta ve dijital platformlarda profesyonel reklam yönetimi.',
    fullDescription: 'Dijital reklam bütçenizi en verimli şekilde kullanmanızı sağlıyoruz. Google Ads, Facebook/Instagram Ads, YouTube ve diğer platformlarda hedef odaklı reklam kampanyaları oluşturuyor ve yönetiyoruz.',
    image: '/media/projects/genel/advertising.jpg',
    features: [
      'Google Ads yönetimi',
      'Facebook & Instagram Ads',
      'YouTube reklam kampanyaları',
      'LinkedIn Ads',
      'Remarketing stratejileri',
      'A/B test & optimizasyon',
    ],
    relatedProjects: ['lacoste-dijital', 'decathlon-event'],
  },
  {
    id: '10',
    title: 'Sosyal Medya Yönetimi',
    slug: 'social-media-management',
    shortDescription: 'Markanızı sosyal medyada güçlendiren profesyonel içerik ve yönetim.',
    fullDescription: 'Sosyal medya varlığınızı güçlendirmek için stratejik plan, yaratıcı içerik üretimi ve topluluk yönetimi hizmetleri sunuyoruz. Instagram, TikTok, LinkedIn ve diğer platformlarda markanızı etkili şekilde temsil ediyoruz.',
    image: '/media/projects/genel/social-media.jpg',
    features: [
      'İçerik planlaması & takvimi',
      'Görsel & video içerik üretimi',
      'Topluluk yönetimi',
      'Influencer işbirlikleri',
      'Sosyal medya analitiği',
      'Kriz yönetimi',
    ],
    relatedProjects: ['lacoste-dijital', 'moda-lookbook-ss24'],
  },
];

export function getServiceBySlug(slug: string): Service | null {
  return mockServices.find((s) => s.slug === slug) || null;
}
