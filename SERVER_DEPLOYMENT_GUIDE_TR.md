# 🌍 Sunucu Kurulum ve Yayına Alma Rehberi (Deployment Guide)

Bu rehber, projenin gerçek bir sunucuda (Production) nasıl yayınlanacağını "hiç bilmeyen birine anlatır gibi" adım adım açıklar.

İki ana yöntem vardır:
1.  **Vercel (Önerilen):** En kolayıdır, sunucu ayarı gerektirmez.
2.  **Ubuntu VPS (Kiralık Sunucu):** Kendi sunucunuz varsa (DigitalOcean, Hetzner, AWS vb.) kullanacağınız yöntemdir.

---

## 🚀 Seçenek 1: Vercel ile 2 Dakikada Yayına Alma (En Kolay)

Eğer Next.js projenizi en hızlı ve sorunsuz şekilde yayınlamak istiyorsanız Vercel en iyi seçenektir.

1.  [vercel.com](https://vercel.com) adresine gidin ve **GitHub hesabınızla** giriş yapın.
2.  **"Add New..."** butonuna tıklayın ve **"Project"** seçeneğini seçin.
3.  GitHub listenizden `bosna-ajans-web-new` reposunu bulun ve **"Import"** deyin.
4.  **Configure Project** ekranında:
    - **Framework Preset:** Next.js (Otomatik seçili gelir)
    - **Root Directory:** `apps/web` olarak seçin (Edit butonuna basıp `apps/web` klasörünü seçin). **Bu adım çok önemlidir.**
5.  **Environment Variables** kısmına `.env` dosyanızdaki değerleri ekleyin (varsa).
6.  **"Deploy"** butonuna basın.

Tebrikler! Siteniz `https://bosna-ajans-web-new.vercel.app` gibi bir adreste yayına girecektir.

---

## 💻 Seçenek 2: Ubuntu Sunucuya (VPS) Kurulum

Eğer kendi kiraladığınız bir sunucunuz varsa, aşağıdaki adımları sırasıyla uygulayın.

### Gereksinimler
- Ubuntu 20.04 veya 22.04 yüklü bir sunucu.
- Sunucuya SSH erişimi (Putty veya Terminal ile).
- Bir alan adı (domain.com) - DNS ayarlarından sunucu IP adresine yönlendirilmiş (A kaydı).

### Adım 1: Sunucuya Bağlanın ve Güncelleyin
Terminalden sunucunuza bağlanın ve paketleri güncelleyin:
```bash
sudo apt update && sudo apt upgrade -y
```

### Adım 2: Gerekli Araçları Yükleyin (Node.js, Git, PM2)
Projenin çalışması için Node.js'in son sürümünü kurmalıyız.

```bash
# Node.js 20 kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Sürümleri kontrol edin (Hata vermemelidir)
node -v
npm -v

# Git ve Process Manager (PM2) kurulumu
sudo apt install git -y
sudo npm install -g pm2 pnpm
```

### Adım 3: Projeyi Sunucuya Çekin
```bash
# Ana dizine gidin
cd /var/www

# Projeyi GitHub'dan indirin (Kendi linkinizi kullanın)
sudo git clone https://github.com/ultraynsol/bosna-ajans-web-new.git bosnaajans

# Klasöre yetki verin (Kullanıcı adınız 'ubuntu' veya 'root' ise ona göre değiştirin)
sudo chown -R $USER:$USER /var/www/bosnaajans

# Klasöre girin
cd /var/www/bosnaajans
```

### Adım 4: Kurulum ve Derleme (Build)
```bash
# Bağımlılıkları yükleyin
pnpm install

# Projeyi derleyin (Build)
pnpm run build
```

> **Not:** Medya dosyalarını (`apps/web/public/media`) yerel bilgisayarınızdan sunucuya (örneğin FileZilla ile) `/var/www/bosnaajans/apps/web/public` altına atmanız gerekmektedir. GitHub'da bu dosyalar yoktur.

### Adım 5: Uygulamayı Başlatın (PM2)
Uygulamanın sürekli çalışması ve sunucu kapansa bile geri açılması için PM2 kullanacağız.

```bash
# Web klasörüne gidin
cd apps/web

# Uygulamayı başlatın
pm2 start npm --name "bosna-web" -- start

# PM2 ayarlarını kaydedin (Otomatik başlangıç için)
pm2 save
pm2 startup
```

Uygulamanız şu an `http://localhost:3000` adresinde çalışıyor.

### Adım 6: Nginx ile Alan Adını Bağlama
Sitenize `domain.com` üzerinden erişilmesi için Nginx (Web Sunucusu) kurmalıyız.

```bash
# Nginx yükleyin
sudo apt install nginx -y

# Yeni bir site ayar dosyası oluşturun (domain.com yerine kendi alan adınızı yazın)
sudo nano /etc/nginx/sites-available/bosnaajans
```

Açılan editöre şunları yapıştırın (domain.com'u değiştirmeyi unutmayın):
```nginx
server {
    listen 80;
    server_name domain.com www.domain.com;

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
Kaydetmek için `CTRL+X`, sonra `Y`, sonra `Enter` yapın.

Ayarı aktif edin ve Nginx'i yeniden başlatın:
```bash
sudo ln -s /etc/nginx/sites-available/bosnaajans /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Adım 7: SSL Sertifikası (HTTPS) Kurulumu
Sitenizin güvenli (kilit simgesi) olması için ücretsiz Let's Encrypt SSL sertifikası kurun.

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d domain.com -d www.domain.com
```
Size e-posta sorarsa girin ve şartları kabul edin (A).

🎉 **Tebrikler!** Siteniz artık yayında.

---

## 🔄 Güncelleme Nasıl Yapılır?
Bilgisayarınızda değişiklik yapıp GitHub'a gönderdikten sonra sunucuda şu komutları çalıştırın:

```bash
cd /var/www/bosnaajans
git pull
pnpm install
pnpm run build
cd apps/web
pm2 restart bosna-web
```
