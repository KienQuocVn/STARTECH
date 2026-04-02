# Phase 3 - Backend Hardening & Frontend Standards

## Cap nhat hien trang

- [~] Auth admin da co JWT + refresh token + cookie flow.
  Nen tang da co, nhung login UI van lo credential seed va can nghiem thu lai tren staging.
- [~] Permission matrix da co o app layer.
  Da co role + permission guard, nhung chua co audit trail DB va chua co UI quan ly permission dong.
- [ ] Swagger docs duoc an tren production.
  Hien van dang bat cong khai tai `/api/docs`.
- [~] Frontend standardization.
  Da co `next/image` o nhieu cho, nhung van con nhieu the `img` thuong va mau sac hardcode.
- [ ] README/backend va tai lieu van hanh duoc chuan hoa.
  Hien README backend van la template Nest mac dinh.

---

# Phase 4 - Dynamic Content & Admin Foundation

## Cap nhat hien trang

- [x] Admin dashboard da co va doc du lieu that tu backend.
- [x] Portfolio CRUD da noi backend va co bo loc/pagination trong admin.
- [x] Leads, showcase, services, settings, feedback, site-content da co API va man quan ly co ban.
- [~] CMS-driven public pages.
  `trang-chu` va `gioi-thieu` da dung CMS mot phan; `dich-vu`, `du-an`, `thiet-ke-website` chua duoc admin hoa toan bo.
- [~] Public settings-driven layout.
  Navbar/Footer da doc `SiteSetting`, nhung phan section content van chua dong bo hoan toan.
- [ ] Workflow publish/content approval.
  Chua co draft/live approval cho page content.

---

# Phase 5 - CMS & Production Hardening

## Uu tien hien tai

- [ ] Go thong tin tai khoan seed khoi giao dien login.
- [ ] Ra soat `prisma/seed.ts` de tranh xoa du lieu khi van hanh production.
- [ ] Chot file env production cho frontend/backend.
- [ ] Nghiem thu lai full luong admin:
  login, refresh, logout, CRUD du an, CRUD content, upload media, cap nhat settings.
- [ ] Chuyen cac diem dung `img` quan trong sang `next/image`.
- [ ] Giam hardcode o cac page `dich-vu` va `thiet-ke-website`, dua noi dung ve CMS.
- [ ] Thiet lap backup, monitoring, alerting, cache/CDN cho production.

## Kiem chung hien co

- [x] Frontend SEO test PASS: `npm test` trong `frontend`.
- [x] Rewrite frontend -> backend da duoc cau hinh trong Next.js.
- [~] Build/lint/typecheck full repo.
  Chua chot lai toan bo trong turn nay vi da tam dung theo yeu cau.
- [~] Deploy readiness.
  San sang cho staging/demo, chua nen danh dau public-production-ready.

---

# Ket luan roadmap

Huong di tiep theo khuyen nghi:

1. Chot P0 production hardening.
2. Day staging va nghiem thu full flow admin/public.
3. Mo rong CMS cho cac section dang hardcode.
4. Sau khi on dinh moi toi uu them test, audit trail va workflow xet duyet noi dung.

## Cap nhat 2026-04-01

- [x] Frontend standardization cho shared UI.
  `ImageWithFallback` da dung `next/image`; token da duoc mo rong sang footer va cac admin shared component.
- [x] README/backend va tai lieu van hanh duoc chuan hoa.
  README backend da duoc viet lai theo he thong STARTECH thuc te.
- [x] Workflow audit actor cho content.
  `site-content` da noi `createdBy`, `updatedBy`, `approvedBy`, `publishedBy` voi auth context.
- [~] Build/lint/typecheck full repo.
  Van chua chay lai trong dot nay theo yeu cau khong build/test.
