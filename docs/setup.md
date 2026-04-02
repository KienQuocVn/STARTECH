# Setup Guide

## 1. Yeu cau moi truong

- Node.js 20+
- npm 10+
- MySQL 8+

## 2. Chay backend local

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

Backend mac dinh:

- `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- API base: `http://localhost:3001/api/v1`
- Health: `http://localhost:3001/health`

## 3. Chay frontend local

```bash
cd frontend
npm install
npm run dev
```

Frontend mac dinh:

- `http://localhost:3000`

## 4. Bien moi truong backend

Toi thieu:

```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=3001
JWT_SECRET=replace-with-strong-secret
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Khuyen nghi them:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=
FROM_NAME=
FROM_EMAIL=

GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=
```

## 5. Bien moi truong frontend

```env
NEXT_PUBLIC_API_BASE_URL=/api/v1
API_BASE_URL=http://127.0.0.1:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Ghi chu:

- `NEXT_PUBLIC_API_BASE_URL` dung cho client-side fetch.
  O local Next.js nen de `/api/v1` de browser di qua rewrite cua frontend, tranh loi do goi truc tiep sai host/port.
- `API_BASE_URL` dung cho server-side fetch trong Next.js.
- `NEXT_PUBLIC_SITE_URL` dung de tao canonical URL, sitemap va metadata SEO.

## 6. Quy trinh chay local day du

1. Khoi dong MySQL.
2. Chay backend.
3. Chay frontend.
4. Kiem tra:
   - frontend render dung
   - backend API tra du lieu
   - `/api/docs` hoat dong
   - `/health` hoat dong
   - contact form gui du lieu thanh cong
   - `/admin/portfolio` load du lieu portfolio

## 7. Build va verify truoc deploy

### Frontend

```bash
cd frontend
npm install
npm test
npm run build
```

### Backend

```bash
cd backend
npm install
npm run build
```

## 8. Luu y production

- Cap nhat `CORS_ORIGINS` bang domain production that.
- Dat `JWT_SECRET` manh, khong dung gia tri mac dinh.
- Dat `NEXT_PUBLIC_SITE_URL` dung domain public.
- Cau hinh reverse proxy HTTPS.
- Bat backup database va log monitoring.
- Dua static asset nang nhu `.spline` len CDN neu traffic lon.

## 9. Kiem tra sau deploy

- Trang chu, dich vu, du an, lien he, gioi thieu load duoc tren mobile va desktop.
- `robots.txt` va `sitemap.xml` tra ve dung.
- Metadata title, description, canonical, Open Graph hien thi dung.
- Admin login, CRUD portfolio, content, showcase hoat dong.
- Contact form, feedback, showcase va API health on dinh.

## 10. Tai lieu lien quan

- `docs/public-deploy-audit.md`
- `docs/architecture.md`
- `docs/database.md`

## 11. Cap nhat 2026-04-01

- Swagger chi duoc xem la san cho local/dev/non-production; production can giu tat nhu logic trong `backend/src/main.ts`.
- Seed backend van destructive theo chu dich va phai bat `ALLOW_DESTRUCTIVE_SEED=true` truoc khi chay.
- Sau dot sua nay, workflow content da ghi duoc actor vao `createdBy`, `updatedBy`, `approvedBy`, `publishedBy` khi thao tac qua auth admin.
- Chua co build/test moi trong dot nay; neu ban tu chay sau do, nen doi chieu ket qua voi `docs/architecture.md` va `docs/bao-cao-de-cuong.md`.
