# BOSNAAJANS — Award-Level Fashion/Editorial Agency Website

Premium fotoğraf & video prodüksiyon ajansı websitesi. Fashion/editorial estetik, TR+EN çift dil, sol sabit rail menü + mega overlay tasarımı.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Animasyon**: Framer Motion + GSAP
- **CMS**: Strapi 5 (self-hosted) + MySQL
- **i18n**: next-intl (/tr /en routing)
- **State**: Zustand

## 📁 Project Structure

```
bosnaajansyeni/
├── apps/
│   ├── web/          # Next.js frontend
│   └── cms/          # Strapi CMS
├── docker/           # Docker Compose for MySQL
├── packages/         # Shared packages (future)
├── turbo.json        # Turborepo config
└── package.json      # Root package
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### 1. Clone & Install

```bash
cd c:\xampp\htdocs\bosnaajansyeni
pnpm install
```

### 2. Start MySQL (Docker)

```bash
cd docker
docker-compose up -d
```

MySQL will be available on port **3307** (to avoid XAMPP conflict).

### 3. Setup Strapi CMS

```bash
cd apps/cms
cp .env.example .env
pnpm install
pnpm develop
```

First run will create admin user at http://localhost:1337/admin

### 4. Start Frontend

```bash
cd apps/web
cp .env.example .env.local
pnpm install
pnpm dev
```

Frontend will be at http://localhost:3000

## 🔧 Environment Variables

### Root (.env.example)
```env
DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_NAME=bosnaajans
DATABASE_USERNAME=bosnaajans
DATABASE_PASSWORD=bosnaajans_secure_pwd
```

### Frontend (apps/web/.env.example)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### CMS (apps/cms/.env.example)
```env
DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_NAME=bosnaajans
DATABASE_USERNAME=bosnaajans
DATABASE_PASSWORD=bosnaajans_secure_pwd
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=your-secret
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm format` | Format code with Prettier |

## 🎨 Design System

### Colors (Fashion Editorial Palette)
- **Ink** (darks): #0B0D10 → #2A3140
- **Paper** (lights): #F6F3EE → #CFC5B5
- **Forest** (accent): #0E3B35 → #2F8B7D

### Fonts
- **Display**: Serif (Canela/Playfair style)
- **Sans**: Grotesk (Inter/Neue Montreal style)

## 📋 Project Phases

- [x] **FAZ 0**: Repo & Base Setup
- [ ] **FAZ 1**: CMS Schemas + Admin Panel
- [ ] **FAZ 2**: Global Shell + Menu
- [ ] **FAZ 3**: Homepage (Sections Builder)
- [ ] **FAZ 4**: Portfolio List
- [ ] **FAZ 5**: Project Detail (Case Study)
- [ ] **FAZ 6**: Services + Contact + Leads
- [ ] **FAZ 7**: Optimization & Hardening

## 📄 License

Private - All rights reserved.
