# Bao cao de cuong cap nhat 2026-04-02

## 1. Ket luan nhanh

Phan viec con ton trong `architecture.md` da duoc xu ly o muc codebase:

- Frontend khong con diem `<img>` trong ma `tsx/ts`; cac diem inline render duoc co lap qua `safe-inline-code.tsx`, trong do script chi con cho JSON-LD.
- Backend da mo rong audit actor cho `category`, `product`, `services`, `pricing_plan`, `showcase_item`, `contact_submission`, `feedback`, `site_setting` va `site_content`.
- Prisma schema da duoc chuan hoa ten model sang PascalCase, van map ve bang legacy hien co nen khong doi cau truc du lieu that.
- Backend test/spec debt da duoc don sach; `tsc --noEmit` va `jest --runInBand` deu xanh.
- Frontend `npm test` va `tsc --noEmit` van xanh sau dot cap nhat.

Vi cac hang muc trong `architecture.md` da duoc dong o muc repo, file do co the xoa khoi bo tai lieu chinh.

## 2. Nhung gi da hoan thanh trong code

### Frontend

- Khong con `<img>` trong ma nguon React/Next o `frontend/`.
- `dangerouslySetInnerHTML` duoc gioi han vao wrapper rieng:
  - `SafeInlineStyle` cho CSS noi bo.
  - `SafeInlineScript` chi render `application/ld+json`.
- Luong schema script tiep tuc dung `serializeJsonForScript`.
- Semantic token va utility token tiep tuc duoc dung cho public/admin surfaces dang active.

### Backend

- Swagger da duoc khoa bang `ENABLE_SWAGGER` va `ALLOW_PRODUCTION_SWAGGER`.
- Seed mac dinh o che do `safe`, chi bootstrap admin; destructive reset can `SEED_MODE=reset` va `ALLOW_DESTRUCTIVE_SEED=true`.
- Audit trail co actor tu auth context cho cac module admin chinh.
- Category da co business-event logging de dong bo voi cac module khac.
- Test cu da duoc cap nhat theo service/controller hien tai.

### Du lieu va schema

- Prisma model naming da duoc chuan hoa:
  - `Category`, `Service`, `Product`, `ProductCategory`, `ProductImage`, `ProductService`
  - `Feedback`, `Feature`, `PricingPlan`, `PricingFeature`
  - `ShowcaseItem`, `ContactSubmission`
- Cac model van `@@map(...)` ve bang cu, nen khong can doi ten bang trong MySQL de dat su dong bo o tang code.
- Semantics hien tai:
  - `Product`: portfolio/project detail.
  - `ShowcaseItem`: tap hop item curated cho homepage/public highlight.
  - `SitePage` + `PageSection` + `FaqItem`: page-level CMS content/workflow.

## 3. Kiem chung da chay

### Backend

```bash
cd backend
npx prisma generate
npx tsc --noEmit
npm test -- --runInBand
```

Ket qua:

- `npx prisma generate`: PASS
- `npx tsc --noEmit`: PASS
- `npm test -- --runInBand`: PASS

### Frontend

```bash
cd frontend
npm test
npx tsc --noEmit
```

Ket qua:

- `npm test`: PASS
- `npx tsc --noEmit`: PASS

## 4. Muc do san sang hien tai

Codebase hien tai da dat muc:

- CMS-driven marketing core + admin foundation o muc code that.
- Co audit trail va actor metadata cho cac domain admin chinh.
- Co quy trinh verify ro rang qua script:
  - `backend`: `npm run verify:all`
  - `frontend`: `npm run verify:all`

## 5. Phan viec con lai khong con la no ky thuat trong repo

Nhung muc duoi day khong con nen xem la blocker cua codebase, ma la cong viec van hanh khi dua len moi truong that:

- Chay checklist staging/production.
- Thuc thi backup/restore tren ha tang that.
- Van hanh monitoring, alerting, CDN/WAF theo moi truong deploy.
- Nghiem thu business flow tren server that sau khi deploy.

Tai lieu nen dung cho giai doan nay:

- `docs/setup.md`
- `docs/STAGING-DEPLOYMENT-GUIDE.md`
- `docs/DEPLOYMENT-SECURITY-CHECKLIST.md`
- `docs/public-deploy-audit.md`
