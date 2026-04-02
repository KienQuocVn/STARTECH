# STARTECH Backend

Backend API cho website va CMS admin STARTECH, xay dung voi NestJS + Prisma + MySQL.

## Pham vi he thong

- Auth admin bang JWT access token + refresh token hash.
- CRUD cho portfolio, services, showcase, feedback, contact leads.
- CMS page-level cho `SitePage`, `PageSection`, `FaqItem`, `SiteSetting`.
- Workflow noi dung `draft -> in_review -> approved -> published`.
- Audit trail qua `content_audit_log` va business event logging.
- Upload media vao `uploads/`.

## Stack

- NestJS
- Prisma
- MySQL
- JWT + bcrypt
- Swagger cho local/dev va moi truong non-production

## Chay local

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

Seed chi duoc phep khi chu dong bat co:

```bash
ALLOW_DESTRUCTIVE_SEED=true npm run seed
```

Khoi dong dev server:

```bash
npm run start:dev
```

Mac dinh:

- App: `http://localhost:3001`
- API base: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api/docs`

## Bien moi truong toi thieu

```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=3001
JWT_SECRET=replace-with-strong-secret
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Bien moi truong bo sung:

```env
ALLOW_DESTRUCTIVE_SEED=false
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

- Swagger chi nen mo o local/dev/staging an toan; production phai tat.
- Seed script la destructive va da co guard `NODE_ENV !== production` + `ALLOW_DESTRUCTIVE_SEED=true`.
- `JWT_SECRET` khong duoc de gia tri fallback khi deploy that.
- Audit actor cho workflow content da duoc noi tu auth context vao:
  - `createdBy`
  - `updatedBy`
  - `approvedBy`
  - `publishedBy`

## Kiem chung

Repo co test backend, nhung can chay lai de xac nhan muc do dong bo voi codebase hien tai truoc khi public production.

## Tai lieu lien quan

- [docs/architecture.md](../docs/architecture.md)
- [docs/bao-cao-de-cuong.md](../docs/bao-cao-de-cuong.md)
- [docs/setup.md](../docs/setup.md)
