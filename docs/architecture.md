# 1. Tong quan kien truc hien tai

- **Frontend**: Next.js App Router (`frontend`) dong vai tro website public va admin dashboard.
- **Backend**: NestJS + Prisma + MySQL (`backend`) cung cap API cho content, product, contact, auth, media, settings.
- **Tich hop FE/BE**: Frontend goi API qua `apiClient`; tren browser su dung rewrite `/api/v1/*` sang backend, tren server-side co the goi truc tiep qua `API_BASE_URL`.
- **Du lieu**: Prisma schema hien tai ket hop giua model legacy (`product`, `services`, `contact_submission`...) va nhom model CMS moi (`SitePage`, `PageSection`, `FaqItem`, `SiteSetting`, `User`, `RefreshToken`, `MediaAsset`).

# 2. Kien truc frontend

## Da hoan thien

- Co day du public routes cho website gioi thieu dich vu:
  `trang-chu`, `gioi-thieu`, `dich-vu`, `du-an`, `du-an/[slug]`, `thiet-ke-website`, `lien-he`, `login`, `admin/*`.
- Co rewrite sang backend trong [next.config.mjs](/d:/Freelancer/STARTECH/frontend/next.config.mjs).
- Navbar va Footer da doc du lieu `public_*` tu `SiteSetting`.
- `trang-chu` va `gioi-thieu` da dung CMS page content tu backend cho metadata va mot phan noi dung hien thi.
- Trang `du-an` va `du-an/[slug]` da dung du lieu that tu backend cho danh sach va chi tiet project.
- Admin dashboard da co cac man quan ly chinh: dashboard KPI, portfolio, leads, content, settings, services, showcase, feedback.
- Login admin dung cookie (`startech_admin_token`, `startech_admin_refresh_token`) thay vi `localStorage`.

## Da dong bo them voi CMS

- `dich-vu`, `du-an`, `thiet-ke-website` hien da dung cung mot bo resolver marketing va render uu tien du lieu `SitePage/PageSection/FaqItem` tu backend.
- Hero, stats, features, process, showcase, CTA va FAQ cua ba trang marketing chinh da co the lay tu `contentJson`/section data thay vi phu thuoc component hardcode.
- Frontend van giu fallback content seed de tranh vo trang neu CMS chua du data, nhung fallback nay dong vai tro backup thay vi luong chinh.
- Phan chua CMS-driven hoan toan hien chu yeu nam o cac trang khac nhu `trang-chu`, `gioi-thieu` va mot so module danh sach client-side chuyen biet.

## Van de can toi uu

- Da bo `images.unoptimized = true`, da them `remotePatterns` va thay mot loat anh sang `next/image`, nhung repo van con mot vai diem dung `<img>` o component phu/legacy nhung khong nam tren luong marketing chinh.
- Da co semantic token co ban trong `frontend/app/globals.css` cho mau sac, surface, border, gradient, shadow va section spacing; van can tiep tuc quy chuan hoa de cover toan bo public/admin UI.
- Luong render marketing va FAQ da duoc dua qua lop `sanitizePlainText`/`sanitizeRichText`; tuy nhien cac diem co `dangerouslySetInnerHTML` khac nhu schema script van can tiep tuc kiem soat theo ngu canh.

# 3. Kien truc backend

## Da co nen tang van hanh

- `main.ts` da bat:
  CORS, Helmet, Compression, static uploads, ValidationPipe, global exception filter, response interceptor, global prefix `api/v1`.
- Co auth module voi JWT + refresh token hash bang bcrypt.
- `JwtStrategy` ho tro lay token tu Bearer header hoac cookie `startech_admin_token`.
- Co rate limit toan cuc qua `ThrottlerModule`.
- Co cac module nghiep vu phuc vu website:
  `auth`, `product`, `category`, `services`, `pricing-plan`, `feedback`, `showcase`, `contact`, `site-content`, `site-settings`, `media`.
- Co `BusinessEventsService` de log su kien nghiep vu o application layer.

## Hien trang thuc te

- API CRUD cho content, product, showcase, settings, leads, services da co that va duoc admin goi den.
- Upload media da co endpoint rieng va luu file vao thu muc `uploads`.
- Contact form da ghi DB, dong thoi co gang day Google Sheets va gui email.
- Prisma seed da nap san du lieu project, page content, FAQ, settings va admin account.

## Rui ro va ton dong

- Swagger chi bat ngoai production trong [main.ts](/d:/Freelancer/STARTECH/backend/src/main.ts).
- Seed script trong [seed.ts](/d:/Freelancer/STARTECH/backend/prisma/seed.ts) van la destructive, nhung da co guard `NODE_ENV !== production` va bat buoc `ALLOW_DESTRUCTIVE_SEED=true` truoc khi cho phep chay.
- Backend README van la template mac dinh cua Nest, chua phan anh he thong that.
- Van con dau vet config cu/commented trong [configuration.ts](/d:/Freelancer/STARTECH/backend/src/config/configuration.ts).
- Test backend trong repo ton tai, nhung muc do dong bo voi codebase hien tai chua duoc xac nhan day du.
- Workflow content da day du hon, nhung ban ghi actor (`createdBy`, `updatedBy`, `approvedBy`, `publishedBy`) chua duoc noi den auth context nen audit trail moi dung tot cho action/type/metadata, chua du cho truy vet danh tinh day du.

# 4. Du lieu va mo hinh CMS

## Diem manh

- Da co nhom bang CMS moi phuc vu page-level content:
  `site_page`, `page_section`, `faq_item`, `site_setting`.
- Da co nhom bang admin/auth:
  `user`, `refresh_token`.
- Da co bang media:
  `media_asset`.
- Da co du lieu portfolio, category, service, pricing, feedback, contact leads cho website va admin.

## Han che

- Schema dang o giai doan chuyen tiep:
  model legacy viet thuong/snake_case tron lan voi model moi PascalCase.
- Chua co workflow draft/publish/approval cho page content.
- Chua co audit trail o database cho thay doi noi dung/admin action, moi dung o muc business-event logging trong app layer.
- Ownership giua `product` (portfolio), `showcase_item` va `site_content` da co, nhung semantics chua that su duoc chuan hoa cho giai doan mo rong sau nay.

# 5. Danh gia theo muc tieu san pham

## Muc tieu user dat ra

Du an huong den website gioi thieu dich vu thiet ke website gom:

- Trang public gioi thieu tong quan.
- Trang du an/portfolio.
- Trang dich vu.
- Trang admin dashboard de quan ly noi dung va du lieu hien thi.

## Muc do dap ung hien tai

- **Da dap ung tot o muc MVP/mo rong som**:
  public site da co nhieu route, co admin, co CMS nen tang, co data project/leads/settings that.
- **Chua dap ung tron ven o muc CMS-driven site**:
  nhieu section marketing van hardcode trong frontend, admin chua thuc su dieu khien toan bo noi dung public.
- **Chua dat muc production hardening day du**:
  can xu ly swagger public, seed/auth/deploy, quy trinh env, backup, va regression test.

# 6. Ket luan kien truc

- Nen tang hien tai **khong con la bo mockup don thuan**. Day la codebase da co FE, BE, database schema, auth, admin va du lieu that.
- Tuy nhien, kien truc van dang o trang thai **MVP+ / CMS-driven marketing core + admin foundation**, chua nen mo ta la "da san sang public production" neu chua harden them cac luong van hanh va test.
- Huong uu tien hop ly luc nay khong phai xay them nhieu module moi, ma la:
  1. Mo rong CMS-first approach sang cac trang public con lai.
  2. Hardening auth/deploy/security/audit metadata.
  3. Chuan hoa tai lieu, test va quy trinh van hanh production.
# 0. Cap nhat gan nhat

- Da bo sung workflow content cho CMS page theo huong `draft -> in_review -> approved -> published`.
- Da bo sung bang version snapshot live `site_page_version` va audit trail database `content_audit_log`.
- Public API `site-content/page/:slug` uu tien doc ban published neu da co snapshot; du lieu cu chua publish van co fallback.
- Admin content da co them thao tac `submit review`, `request changes`, `approve`, `publish live`.
- Admin content da bo sung `workflow notes` va template JSON co ban cho section marketing de giam nhap tay.
- `dich-vu`, `du-an`, `thiet-ke-website` da duoc dua sang bo render marketing moi, uu tien doc title, CTA, stats, card item, showcase item va FAQ tu CMS.
- Da bo `images.unoptimized = true`, them `remotePatterns` cho Next Image va thay mot loat `img` bang `next/image` o home, social sidebar, project detail va cac section marketing lien quan.
- Da them semantic token co ban trong `frontend/app/globals.css`.
- FAQ/noi dung user-facing dang render text da duoc dua qua lop sanitize cho ca plain text va rich text.
- Swagger da duoc dat dieu kien chi mo o moi truong khong phai production.
- Backend workflow da duoc siep chat hon: page phai co section truoc khi submit review, version phai o `in_review` moi duoc approve, va phai `approved` moi duoc publish.

# 7. Cap nhat 2026-04-01

- Da thay diem `<img>` legacy cuoi cung trong frontend runtime sang `next/image` qua `frontend/components/image-with-fallback.tsx`; cac the `<img>` con lai nam trong email template backend.
- Da mo rong semantic token cho public/admin UI voi nhom token admin shell, panel, nav active va status; cac component shared `TopBar`, `Sidebar`, `SlideOver`, `KPICard`, `Footer` da duoc chuyen sang dung token thay vi tiep tuc hardcode mau/chieu sau.
- Da siet cac diem `dangerouslySetInnerHTML` theo ngu canh: `SchemaScript` serialize JSON-LD an toan cho script tag, `chart.tsx` sanitize CSS identifier/value truoc khi inject style.
- Da noi actor tu auth context vao workflow content: `create/update/review/approve/publish` tren `site-content` hien cap nhat `createdBy`, `updatedBy`, `approvedBy`, `publishedBy` dong thoi van ghi `actorId` vao `content_audit_log`.
- Da viet lai `backend/README.md` theo he thong STARTECH thuc te va don `backend/src/config/configuration.ts` de loai bo dau vet config TypeORM cu.
- Chua build/test lai trong dot cap nhat nay theo dung yeu cau user, vi vay trang thai verification van la `code updated, can user tu chay build/test`.
