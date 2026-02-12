# 🚀 Bosna Ajans Web Projesi - GitHub Yükleme ve Kurulum Rehberi

Bu rehber, projenin GitHub'a yüklenmesi ve yeni bir bilgisayara/sunucuya kurulumu için gerekli adımları içerir.

## 📂 Proje Bilgileri

- **Yerel Klasör:** `c:\xampp\htdocs\bosnaajansyeni`
- **GitHub Repo:** `https://github.com/ultraynsol/bosna-ajans-web-new.git`
- **Branch:** `main`

> **⚠️ ÖNEMLİ NOT:** Yüksek boyutlu medya dosyaları (`apps/web/public/old-site` ve `apps/web/public/media`) GitHub limitleri nedeniyle repo dışı bırakılmıştır. Kurulum yaptıktan sonra bu klasörleri kendi yedeğinizden manuel olarak taşımanız gerekmektedir. Aksi takdirde görseller yüklenmeyecektir.

---

## 1️⃣ GitHub'a Yükleme (Otomatik Yapıldı)

Proje şu komutlarla GitHub'a yüklenmiştir:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ultraynsol/bosna-ajans-web-new.git
git push -u origin main
```

*(Not: `node_modules`, `public/old-site`, `public/media` otomatik olarak dışlanmıştır.)*

---

## 2️⃣ Yeni Bir Bilgisayara Kurulum (Clone)

Projeyi başka bir bilgisayara veya sunucuya çekmek için:

### 1. Terminali Açın ve Klasöre Gidin
```bash
cd c:\xampp\htdocs
```

### 2. Projeyi İndirin (Clone)
```bash
git clone https://github.com/ultraynsol/bosna-ajans-web-new.git bosnaajansyeni
cd bosnaajansyeni
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### 4. Medya Dosyalarını Geri Yükleyin
GitHub reposunda `apps/web/public/media` ve `apps/web/public/old-site` klasörleri boştur.
**Lütfen `apps/web/public/` altına eski projenizden veya yedeğinizden `media` ve `old-site` klasörlerini kopyalayın.**

### 5. Çevresel Değişkenleri Ayarlayın (.env)
Kök dizindeki ve `apps/web` dizinindeki `.env` dosyalarını oluşturun. Örnek `.env.example` dosyasını kopyalayıp düzenleyebilirsiniz.

### 6. Projeyi Başlatın
```bash
npm run dev
```

Artık proje `http://localhost:3000` adresinde çalışacaktır.
