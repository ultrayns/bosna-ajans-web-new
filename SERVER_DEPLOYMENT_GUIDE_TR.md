# 🌍 Sunucu Kurulum ve Yayına Alma Rehberi (Deployment Guide)

Bu rehber, projenin gerçek bir sunucuda (Production) nasıl yayınlanacağını "hiç bilmeyen birine anlatır gibi" adım adım açıklar.

İki ana yöntem vardır:
2.  **Plesk Panel (Sizin Sunucunuz):** Paylaştığınız ekran görüntüsüne göre sunucunuzda **Plesk** yüklü ve **Node.js desteği** var.

---

## 📦 Veritabanı ve Admin Paneli
- **Veritabanı:** JSON dosyaları (`apps/web/src/lib/data`). Otomatik yüklenir.
- **Admin Paneli:** `bosnaajans.com/admin` (Kullanıcı: `admin`, Şifre: `bosna2025`).

---

## 🚀 Seçenek 1: Plesk Panel ile Kurulum (Sizin Hostinginiz)

Ekran görüntünüze göre sunucunuzda **Plesk** ve **Node.js** uzantısı kurulu. Bu harika! Kurulumu doğrudan buradan yapabiliriz.

### Adım 1: "Git" Aracını Kullanarak Dosyaları Çekin
1.  Plesk panelinizde **"Git"** simgesine tıklayın.
2.  Açılan sayfada **Repo URL** kısmına şunu yapıştırın:
    `https://github.com/ultraynsol/bosna-ajans-web-new.git`
3.  **Deploy (Dağıt)** modunu "Manual" veya "Automatic" seçebilirsiniz.
4.  **Oluştur (Create)** butonuna basın. GitHub'daki dosyalarınız sunucuya inecektir (Genellikle `httpdocs/bosnaajans` gibi bir klasöre).

### Adım 2: Node.js Ayarlarını Yapılandırın
1.  Plesk ana sayfasına dönün ve **"Node.js"** simgesine tıklayın.
2.  Şu ayarları yapın:
    - **Node.js Version:** `20.x` veya üzeri (Ekran görüntünüzde `24.13.0` var, bu uygundur).
    - **Package Manager:** `pnpm` (Eğer listede yoksa `npm` seçin).
    - **Document Root:** Projenin ana klasörü (Örn: `httpdocs/bosnaajans`).
    - **Application Root:** Projenin ana klasörü (Örn: `httpdocs/bosnaajans`). **Burada `apps/web` seçmeyin, monorepo olduğu için kök dizini kullanmalıyız.**
    - **Application Mode:** `Production`.
    - **Application Startup File:** `apps/web/server.js` (veya Next.js standalone build kullanıyorsanız).
      *Ancak en garantisi:* Startup File yerine sadece **"Run Script"** butonunu kullanmaktır.

3.  **"NPM Install"** butonuna basın. (Kök dizindeki bağımlılıkları yükler).

4.  **"Run Script"** butonuna tıklayın ve:
    - `build` komutunu çalıştırın.
    - Daha sonra `start` komutunu çalıştırın (veya `apps/web` içindeki start komutunu).

> **💡 İPUCU:** Monorepo yapıları (apps/web) Plesk'te bazen karmaşık olabilir. Eğer "NPM Install" veya "Build" hata verirse, SSH (Terminal) ile bağlanıp şu komutları elle yazmak daha sağlıklı olabilir:
> ```bash
> cd httpdocs/bosnaajans
> npm install -g pnpm
> pnpm install
> pnpm run build
> cd apps/web
> pm2 start npm --name "bosna-web" -- start
> ```

5.  **"Restart"** butonuna basın.

### Adım 3: Medya Dosyaları (Çok Önemli!)
GitHub'dan gelen projede **resimler ve videolar eksiktir**.
1.  Bilgisayarınızdaki `apps/web/public/media` ve `apps/web/public/old-site` klasörlerini bulun.
2.  Plesk'te **"Dosya Yöneticisi"**ni açın.
3.  `httpdocs/bosnaajans/apps/web/public` klasörüne gidin.
4.  Buraya elinizdeki `media` ve `old-site` klasörlerini yükleyin. Aksi takdirde sitenizde görseller gözükmez.

---

## 🚀 Seçenek 2: Vercel ile (Alternatif)

**Müjde!** Bu proje şu anda "Dosya Tabanlı (JSON)" bir veritabanı sistemi kullanmaktadır.
Yani verileriniz `apps/web/src/lib/data` klasöründeki dosyalarda saklanır.
Bu sayede:
- **Veritabanı kurulumu yapmanıza gerek yoktur.**
- **Verileriniz kodla birlikte GitHub'a otomatik yüklenmiştir.**
- Sunucuda ekstra bir MySQL/PostgreSQL ayarı yapmanıza gerek kalmaz.

---

## 🔑 Admin Paneli ve İçerik Yönetimi

Sitenizin içeriklerini (Projeler, Blog, Hizmetler vb.) yönetmek için hazır bir Admin Paneli bulunmaktadır.

- **Giriş Adresi:** `http://alanadiniz.com/admin` (veya `localhost:3000/admin`)
- **Varsayılan Kullanıcı Adı:** `admin`
- **Varsayılan Şifre:** `bosna2025`

> **Güvenlik Uyarısı:** Bu şifreyi değiştirmek için sunucudaki `.env` dosyasına şu satırları ekleyin:
> ```env
> ADMIN_USERNAME=yeni_kullanici_adi
> ADMIN_PASSWORD=yeni_guclu_sifre
> ```

### ⚠️ Önemli: Çalışma Mantığı (Local vs Sunucu)
Admin paneli **dosya tabanlı** çalıştığı için verileri doğrudan sunucudaki dosyalara yazar.
- **ÖNERİLEN YÖNTEM:** İçerik girişlerini **kendi bilgisayarınızda (Local)** yapın. Sonra `git push` ile GitHub'a ve oradan sunucuya gönderin. Böylece yedeğiniz olur.
- **ALTERNATİF:** Sunucuda doğrudan düzenleme yapabilirsiniz. Ancak daha sonra bilgisayarınızdan kod gönderirken "git conflict" (çakışma) yaşamamak için dikkatli olmalısınız.

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
