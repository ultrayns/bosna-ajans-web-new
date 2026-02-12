bizi# 🚀 Bosna Ajans - Sunucu Kurulum ve Yayınlama Rehberi

Bu döküman, **bosnaajans.com** web sitesini sıfırdan bir sunucuya (Ubuntu/Linux) kurmak ve yayınlamak için hazırlanmıştır. Sistemde Strapi **yoktur**, kendi özel admin panelimiz mevcuttur.

---

## 📋 1. Sunucu Hazırlığı (İlk Kez Yapılacaklar)

Sunucunuza terminal (SSH) üzerinden bağlandıktan sonra sırasıyla şu komutları uygulayın.

### Adım 1.1: Sistemi Güncelleyin ve Temel Paketleri Kurun
Sunucuyu güncelleyin ve temel paketleri kurun:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip build-essential ffmpeg
```

> **Not:** `ffmpeg` paketi, video yüklemelerinde otomatik sıkıştırma özelliği için gereklidir.

### Adım 1.2: Gerekli Yazılımları Kurun (Node.js, Nginx, PM2)
Web sitemizin çalışması için modern JavaScript altyapısına ihtiyacımız var.

```bash
# Node.js 20 kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx (Web Sunucusu) kurulumu
sudo apt install -y nginx

# PM2 (Uygulamayı sürekli ayakta tutan araç) kurulumu
sudo npm install -g pm2
sudo npm install -g pnpm
```

---

## 📤 2. Dosyaların Sunucuya Atılması

Projenizi sunucuya göndermek için iki yöntem kullanabilirsiniz. "Hiç bilmeyen" biri için en kolayı **FileZilla** programıdır, ancak profesyonel yöntem **Git** kullanmaktır.

### Yöntem A: FileZilla ile Yükleme (Kolay)
1. Bilgisayarınızda projenin olduğu klasörde şu dosyaları SİLMEYİN, gerisini sunucuya atın:
   - `node_modules` (Bunu sakın atma! Sunucuda kurulacak)
   - `.next` (Bu da sunucuda oluşacak)
   - `.git`
   
2. Sunucuda `/var/www/bosnaajans` klasörü oluşturun:
   ```bash
   sudo mkdir -p /var/www/bosnaajans
   sudo chown -R $USER:$USER /var/www/bosnaajans
   ```
   
3. FileZilla ile bağlanıp dosyaları bu klasöre sürükleyin.

### Yöntem B: Git ile Çekme (Profesyonel)
Eğer projeniz GitHub/GitLab'da ise:
```bash
cd /var/www
sudo git clone <repo-adresi> bosnaajans
sudo chown -R $USER:$USER bosnaajans
cd bosnaajans
```

---

## ⚙️ 3. Uygulamanın Kurulması ve Derlenmesi

Dosyalar sunucuya geldikten sonra, uygulamanın çalışır hale gelmesi için bu adımları yapın.

```bash
# Proje klasörüne girin
cd /var/www/bosnaajans

# 1. Ana dizinde bağımlılıkları yükleyin
pnpm install

# 2. Web uygulaması klasörüne girin
cd apps/web

# 3. Ortam değişkenlerini ayarlayın
# .env.example dosyasını .env.local olarak kopyalayın
cp .env.example .env.local

# Dosyayı düzenlemek için açın
nano .env.local
```

Açılan ekranda şu ayarları yapın (Ctrl+X, sonra Y, sonra Enter ile kaydedip çıkın):
```env
NEXT_PUBLIC_SITE_URL=https://bosnaajans.com
# Admin panel şifreleme anahtarı (rastgele uzun bir şifre yazın)
NEXTAUTH_SECRET=cok-gizli-rastgele-sifre-yaz-buraya
```

**Şimdi uygulamayı derleyin (Build):**
```bash
# Bu işlem sunucu hızına göre 1-2 dakika sürebilir
pnpm build
```

---

## 🚀 4. Uygulamayı Başlatma (PM2)

Uygulamanın sunucu kapansa bile otomatik açılması için PM2 kullanacağız.

```bash
# Web klasöründe olduğunuzdan emin olun (/var/www/bosnaajans/apps/web)

# Uygulamayı başlat
pm2 start npm --name "bosnaajans" -- start

# Başlangıçta otomatik açılması için kaydet
pm2 save
pm2 startup
# (Bu komut size bir kod verecek, o kodu kopyalayıp yapıştırın ve enter'a basın)
```

---

## 🌐 5. Alan Adı Ayarları (Nginx & SSL)

Sitenin **bosnaajans.com** adresinde görünmesi için Nginx ayarı yapacağız.

### Adım 5.1: Nginx Ayar Dosyası Oluşturma

```bash
sudo nano /etc/nginx/sites-available/bosnaajans
```

Açılan dosyaya şunları yapıştırın:

```nginx
server {
    server_name bosnaajans.com www.bosnaajans.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kaydet ve çık (Ctrl+X -> Y -> Enter).

### Adım 5.2: Ayarı Aktif Etme

```bash
# Dosyayı aktif klasöre linkle
sudo ln -s /etc/nginx/sites-available/bosnaajans /etc/nginx/sites-enabled/

# Varsayılan ayarı sil (çakışmasın diye)
sudo rm /etc/nginx/sites-enabled/default

# Ayarları kontrol et
sudo nginx -t

# Her şey "OK" ise Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Adım 5.3: SSL Sertifikası (HTTPS - Yeşil Kilit) 🔒

Sitenin güvenli (https) olması için ücretsiz Certbot kullanacağız.

```bash
sudo apt install -y certbot python3-certbot-nginx

# Sertifikayı al
sudo certbot --nginx -d bosnaajans.com -d www.bosnaajans.com
```

Size e-posta soracak ve şartları kabul etmenizi isteyecek. "Redirect" sorusu gelirse **2**'yi seçin (tüm trafiği HTTPS'e yönlendir).

---

## ✅ Tebrikler!

Artık **https://bosnaajans.com** adresine girdiğinizde siteniz yayında olmalı!

---

## 🔄 Güncelleme Yapılacağı Zaman (ÇOK ÖNEMLİ)

Sitede değişiklik yaptınız ve tekrar sunucuya atmak istiyorsunuz.

🔴 **DİKKAT:** Admin panelinden eklediğiniz projeler ve ayarlar sunucudaki `src/lib/data` klasöründeki dosyalara kaydedilir. Eğer bilgisayarınızdaki (içeriği eski olan) dosyaları sunucuya atarsanız, **SERVERDAKİ VERİLERİNİZ SİLİNİR/ESKİ HALİNE DÖNER!**

Veri kaybı yaşamamak için şu kurala uyun:

1.  **Önce Yedeği Alın:** FileZilla ile sunucuya bağlanıp `apps/web/src/lib/data` klasörünü bilgisayarınıza indirin (yedekleyin).
2.  **Dosyaları Gönderin:** Bilgisayarınızdaki güncel kodları sunucuya atın.
3.  **Veriyi Geri Yükleyin:** Eğer yerel bilgisayarınızda veri girmediyseniz, 1. adımda indirdiğiniz güncel `data` klasörünü tekrar sunucuya atarak verilerinizi koruyun.

**Güncelleme Adımları:**

1. Dosyaları FileZilla ile atın (verilerinize dikkat edin).
2. Terminalden sunucuya bağlanın:
   ```bash
   cd /var/www/bosnaajans/apps/web
   pnpm install  # (Eğer yeni paket eklediyseniz)
   pnpm build    # (Değişikliklerin işlenmesi için ŞART)
   pm2 restart bosnaajans
   ```
