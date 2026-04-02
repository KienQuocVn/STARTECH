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
ADMIN_EMAIL=admin@startech.local ADMIN_PASSWORD=YourStrongPassword2026 npm run seed
npm run start:dev
```

Backend mac dinh:

- `http://localhost:3001`
- API base: `http://localhost:3001/api/v1`
- Health: `http://localhost:3001/health`
- Swagger: `http://localhost:3001/api/docs` khi `ENABLE_SWAGGER=true`

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
ENABLE_SWAGGER=true
ALLOW_PRODUCTION_SWAGGER=false
SWAGGER_PATH=api/docs
SEED_MODE=safe
ALLOW_DESTRUCTIVE_SEED=false
```

Bien bo sung:

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
- `API_BASE_URL` dung cho server-side fetch trong Next.js.
- `NEXT_PUBLIC_SITE_URL` dung de tao canonical URL, sitemap va metadata SEO.

## 6. Verify nhanh truoc khi lam viec

### Backend

```bash
cd backend
npm run verify:all
```

### Frontend

```bash
cd frontend
npm run verify:all
```

## 7. Luu y production

- Production chi nen mo Swagger khi co chu dich ro rang bang `ENABLE_SWAGGER=true` va `ALLOW_PRODUCTION_SWAGGER=true`.
- Seed mac dinh la safe bootstrap; khong chay destructive reset tren production database.
- `JWT_SECRET` bat buoc phai la gia tri that, khong co fallback production.
- Audit actor cho admin workflow da duoc noi vao business-event log va `content_audit_log`.

## 8. Quy trinh deploy va van hanh

Repo da co tai lieu rieng cho van hanh moi truong that:

- `docs/STAGING-DEPLOYMENT-GUIDE.md`
- `docs/DEPLOYMENT-SECURITY-CHECKLIST.md`
- `docs/public-deploy-audit.md`
- `docs/bao-cao-de-cuong.md`
- `docs/database.md`
