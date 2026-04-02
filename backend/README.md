# STARTECH Backend

Backend API cho website public va he thong CMS/admin STARTECH, xay dung voi NestJS, Prisma va MySQL.

## Pham vi he thong

- Auth admin bang JWT access token + refresh token hash.
- CRUD cho portfolio, services, showcase, feedback va contact leads.
- CMS page-level cho `SitePage`, `PageSection`, `FaqItem`, `SiteSetting`.
- Workflow noi dung `draft -> in_review -> approved -> published`.
- Audit trail luu vao `content_audit_log`, da gan actor tu auth context.
- Upload media vao `uploads/`.

## Stack

- NestJS
- Prisma
- MySQL
- JWT + bcrypt
- Swagger co dieu kien theo environment flags

## Chay local

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Mac dinh:

- App: `http://localhost:3001`
- API base: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api/docs` khi `ENABLE_SWAGGER=true`

## Seed database

Seed mac dinh chay o che do an toan: chi bootstrap tai khoan admin, khong xoa du lieu hien co.

```bash
ADMIN_EMAIL=admin@startech.local \
ADMIN_PASSWORD=MyStrongPassword2026 \
npm run seed
```

Neu can reset toan bo demo dataset, phai bat ro rang che do destructive:

```bash
SEED_MODE=reset \
ALLOW_DESTRUCTIVE_SEED=true \
ADMIN_EMAIL=admin@startech.local \
ADMIN_PASSWORD=MyStrongPassword2026 \
npm run seed
```

Khong bao gio chay reset seed tren production database.

## Bien moi truong toi thieu

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

Bien moi truong bo sung:

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

## Script thuong dung

```bash
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Luu y van hanh

- Swagger duoc dieu khien bang `ENABLE_SWAGGER` va mac dinh bi chan o production tru khi bat them `ALLOW_PRODUCTION_SWAGGER=true`.
- Seed script mac dinh la safe bootstrap; destructive reset yeu cau `SEED_MODE=reset` va `ALLOW_DESTRUCTIVE_SEED=true`.
- `JWT_SECRET` khong duoc de gia tri fallback khi deploy that.
- Audit actor cho workflow content da duoc noi tu auth context vao `createdBy`, `updatedBy`, `approvedBy`, `publishedBy` va audit metadata.

## Kiem chung

Repo da co test backend, bao gom workflow content. Van nen chay lai full test suite truoc khi public production.

## Tai lieu lien quan

- [docs/bao-cao-de-cuong.md](../docs/bao-cao-de-cuong.md)
- [docs/setup.md](../docs/setup.md)
- [docs/database.md](../docs/database.md)
