# 🚀 BOSNAAJANS - Detaylı Kurulum Kılavuzu

Bu döküman, Bosnaajans web sitesini sıfırdan nasıl kuracağınızı adım adım açıklamaktadır.

---

## 📋 Gereksinimler

Kuruluma başlamadan önce aşağıdaki yazılımların sisteminizde kurulu olduğundan emin olun:

| Yazılım | Minimum Versiyon | Önerilen | İndirme Linki |
|---------|-----------------|----------|---------------|
| **Node.js** | 18.x | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 8.x | 9.x | `npm install -g pnpm` |
| **Git** | 2.x | En güncel | [git-scm.com](https://git-scm.com/) |
| **Docker** *(opsiyonel)* | 20.x | En güncel | [docker.com](https://docker.com/) |

---

## 📁 Proje Yapısı

```
bosnaajansyeni/
├── apps/
│   └── web/              # Next.js Frontend
│       ├── src/
│       │   ├── app/      # App Router sayfaları
│       │   ├── components/   # React bileşenleri
│       │   ├── lib/      # Utility fonksiyonlar ve veri
│       │   └── styles/   # CSS dosyaları
│       └── public/
│           └── media/    # Görseller ve videolar
├── packages/             # Paylaşılan paketler
├── docker/               # Docker compose dosyaları
└── videos/               # Ham video dosyaları
```

---

## 🔧 Kurulum Adımları

### Adım 1: Projeyi İndirin

```powershell
# Projeyi klonlayın (Git ile)
git clone <repository-url> bosnaajansyeni
cd bosnaajansyeni

# VEYA mevcut klasörde çalışıyorsanız
cd c:\xampp\htdocs\bosnaajansyeni
```

### Adım 2: Bağımlılıkları Yükleyin

```powershell
# pnpm'i global olarak yükleyin (henüz yoksa)
npm install -g pnpm

# Proje bağımlılıklarını yükleyin
pnpm install
```

> **Not:** İlk yüklemede yaklaşık 200MB bağımlılık indirilecektir.

### Adım 3: Environment Dosyasını Oluşturun

```powershell
# Web uygulaması için .env.local dosyası oluşturun
cd apps/web
copy .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# Temel Ayarlar
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# API ayarları (isteğe bağlı)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### Adım 4: Geliştirme Sunucusunu Başlatın

```powershell
# Web klasöründeyken
cd apps/web

# Geliştirme sunucusunu başlatın
pnpm dev
```

✅ Başarılı! Tarayıcınızda açın: **http://localhost:3000**

---

## 🌐 Admin Paneli Erişimi

Admin paneline erişmek için:

1. Tarayıcıda açın: **http://localhost:3000/admin**
2. Giriş bilgileri:
   - **E-posta:** admin@bosnaajans.com
   - **Şifre:** (ilk kurulumda belirlenir)

---

## 🖼️ Medya Dosyaları

Görseller ve videolar `apps/web/public/media/` klasöründe bulunur:

```
public/media/
├── clients/          # Referans logoları
├── featured/         # Ana sayfa öne çıkan videolar
├── projects/         # Proje görselleri
│   └── genel/        # Genel proje görselleri
├── team/             # Ekip fotoğrafları
└── videos/           # Hizmet videoları
```

### Yeni Medya Ekleme

1. Görselleri ilgili klasöre kopyalayın
2. Dosya adlarında Türkçe karakter ve boşluk kullanmaktan kaçının
3. Önerilen formatlar:
   - **Görsel:** JPG, PNG, WebP
   - **Video:** MP4 (H.264)

---

## 🏗️ Production Build

Canlıya almadan önce production build oluşturun:

```powershell
cd apps/web

# Production build oluştur
pnpm build

# Build'i test et
pnpm start
```

---

## 🐳 Docker ile Kurulum (Opsiyonel)

Docker kullanarak tüm servisleri başlatmak için:

```powershell
# Proje kök dizininde
docker-compose up -d
```

Bu komut:
- MySQL veritabanını (port 3307)
- Strapi CMS'i (port 1337)
- Next.js frontend'i (port 3000)

başlatacaktır.

---

## 📊 Veri Yönetimi

### JSON Veri Dosyaları

Veriler `apps/web/src/lib/data/` klasöründe JSON formatında saklanır:

| Dosya | İçerik |
|-------|--------|
| `homepage.json` | Ana sayfa içerikleri |
| `projects.json` | Portfolyo projeleri |
| `categories.json` | Proje kategorileri |
| `services.json` | Hizmet bilgileri |
| `featured-works.json` | Öne çıkan çalışmalar |
| `settings.json` | Site ayarları |
| `clients.json` | Referans firmaları |

### Admin Panelinden Düzenleme

1. **http://localhost:3000/admin** adresine gidin
2. Sol menüden düzenlemek istediğiniz bölümü seçin
3. Değişiklikleri kaydedin

---

## 🔍 Sorun Giderme

### "pnpm: command not found" Hatası

```powershell
npm install -g pnpm
```

### Port 3000 Kullanımda

```powershell
# Farklı port kullanın
pnpm dev -- -p 3001
```

### Görseller Yüklenmiyor

1. Dosya yolunun doğru olduğunu kontrol edin
2. Dosya adında özel karakter olmadığından emin olun
3. Dosya boyutunun çok büyük olmadığını kontrol edin (max 10MB önerilir)

### Build Hataları

```powershell
# Cache temizleyin
pnpm store prune
rm -rf node_modules
rm -rf .next
pnpm install
pnpm build
```

---

## ⚡ Hızlı Başlangıç Komutları

```powershell
# 1. Projeyi kurun
cd c:\xampp\htdocs\bosnaajansyeni
pnpm install

# 2. Web uygulamasını başlatın
cd apps/web
pnpm dev

# 3. Tarayıcıda açın
# http://localhost:3000
```

---

## 📞 Destek

Sorun yaşarsanız:
- GitHub Issues açın
- info@bosnaajans.com adresine e-posta gönderin

---

*Son güncelleme: Şubat 2026*
