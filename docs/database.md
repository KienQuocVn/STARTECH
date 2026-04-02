# Database Notes

## 1. Trang thai hien tai

Schema Prisma da duoc chuan hoa ten model o tang code, trong khi van giu mapping ve bang legacy hien co trong MySQL:

- `Category` -> `category`
- `Service` -> `services`
- `Product` -> `product`
- `ProductCategory` -> `product_cat`
- `ProductImage` -> `images`
- `ProductService` -> `product_service`
- `Feedback` -> `feedback`
- `Feature` -> `feature`
- `PricingPlan` -> `pricing_plan`
- `PricingFeature` -> `pricing_feature`
- `ShowcaseItem` -> `showcase_item`
- `ContactSubmission` -> `contact_submission`
- `SitePage`, `PageSection`, `FaqItem`, `SiteSetting`, `SitePageVersion`, `ContentAuditLog`

Dieu nay giup codebase dong bo naming ma khong can doi ten bang du lieu that.

## 2. Ownership semantics

- `Product`: du lieu portfolio / project detail.
- `ShowcaseItem`: danh sach item duoc curate de highlight o homepage/public section.
- `SitePage` + `PageSection` + `FaqItem`: page-level CMS content co workflow `draft -> in_review -> approved -> published`.
- `SiteSetting`: config noi dung/public chrome nhu navigation, footer, contact form, site meta.

## 3. Audit trail

Audit trail luu o `content_audit_log`.

Hien tai business-event logging da phu cho:

- `category`
- `product`
- `services`
- `pricing_plan`
- `showcase_item`
- `contact_submission`
- `feedback`
- `site_setting`
- `site_page` / `page_section` / `faq_item`

Metadata audit da bao gom `actorId`, `actorEmail`, `actorRole` khi thao tac di qua auth admin context.

## 4. Seed va du lieu khoi tao

- Seed mac dinh la `safe`: chi bootstrap admin account.
- Seed destructive chi chay khi dong thoi bat:
  - `SEED_MODE=reset`
  - `ALLOW_DESTRUCTIVE_SEED=true`
- Khong co tai khoan admin hardcoded trong tai lieu hay UI.

Vi du seed safe:

```bash
cd backend
ADMIN_EMAIL=admin@startech.local ADMIN_PASSWORD=YourStrongPassword2026 npm run seed
```

## 5. Kiem chung schema/client

Sau khi thay doi `schema.prisma`, quy trinh can chay:

```bash
cd backend
npx prisma generate
npx tsc --noEmit
npm test -- --runInBand
```
