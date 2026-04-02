# 1. Hien trang du an theo codebase thuc te

## Tong quat

Du an hien tai da vuot qua giai doan landing page tinh. Repo da co:

- Frontend Next.js cho website public.
- Backend NestJS + Prisma cho API va admin data.
- Database schema co du lieu portfolio, leads, settings, FAQ, page content, auth.
- Admin dashboard co kha nang xem va cap nhat nhieu nhom du lieu.

Noi cach khac, day la mot he thong website gioi thieu dich vu co backend quan tri that, khong con la bo giao dien mock.

## Nhung gi da lam duoc

- Public site da co cac trang chinh phu hop dinh huong kinh doanh:
  `trang-chu`, `gioi-thieu`, `dich-vu`, `du-an`, `thiet-ke-website`, `lien-he`.
- Admin da co cac man chinh:
  dashboard KPI, quan ly du an, leads, CMS pages, settings, services, showcase, feedback.
- Backend da co auth JWT + refresh token, role/permission, upload media, contact form, site settings, site content.
- Du lieu seed da bao gom:
  project, category, service, FAQ, settings, page content, lead mau va tai khoan admin.

# 2. Danh gia muc do dung voi bai toan user

## Phan dung voi bai toan

- Website da the hien dung huong "gioi thieu dich vu thiet ke website".
- Da co portfolio du an de lam trust/proof.
- Da co lien he va thu thap lead.
- Da co admin dashboard de quan ly mot phan noi dung va du lieu hien thi.

## Phan chua dung hoan toan voi ky vong "admin quan ly noi dung hien thi"

- Admin chua dieu khien duoc toan bo noi dung public site.
- Nhieu section cua `dich-vu` va `thiet-ke-website` van la component hardcode.
- Noi dung marketing, so lieu, image showcase o nhieu cho van phai sua trong code thay vi sua tu admin.
- Chua co workflow draft/publish/approval nen admin sua la tac dong truc tiep vao du lieu live.

# 3. Diem manh cua du an hien tai

- Kien truc tach FE/BE ro rang, de mo rong.
- Co Prisma schema va migration, khong phai code tam.
- Admin auth da chuyen qua cookie thay vi luu token tren browser mot cach kem an toan.
- Co rewrite frontend -> backend de giam do phuc tap khi tich hop.
- Co SiteSetting de quan ly menu, footer, contact form theo huong CMS nhe.
- Co SitePage/PageSection/FaqItem, tao nen tang mo rong sang CMS that trong cac phase tiep theo.

# 4. Van de va canh bao quan trong

## Khong nen deploy public ngay neu chua sua nhung muc duoi day

### P0 - Bat buoc truoc khi public

1. **Tat Swagger tren production**
   `/api/docs` dang mo cong khai o moi moi truong.

2. **Go bo thong tin dang nhap seed khoi UI**
   Trang login dang hien san email/password admin mau.

3. **Rao lai quy trinh seed**
   `prisma/seed.ts` dang xoa du lieu roi seed lai; rat nguy hiem neu dung nham vao production DB.

4. **Chot env production ro rang**
   Can xac nhan `API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, `JWT_SECRET`, `DATABASE_URL`, CORS origins, email/google sheet configs.

5. **Xac nhan lai luong admin tren moi truong deploy that**
   Ve ly thuyet rewrite + cookie co the chay, nhung can nghiem thu dang nhap, CRUD, upload media, logout, refresh token tren staging.

## P1 - Nen lam som sau P0

1. Chuyen cac `img` quan trong sang `next/image`.
2. Chuan hoa design token/thong so giao dien.
3. Giam phan hardcode noi dung o public pages, dua ve CMS nhieu hon.
4. Viet lai README/backend va tai lieu deploy cho sat he thong that.
5. Ra soat lai test backend va regression test cho admin/auth.

## P2 - Nang cap nen tang

1. Them workflow draft/publish.
2. Them audit trail thuc su o database.
3. Chuan hoa naming schema va domain model.
4. Them monitoring, backup, alerting, CDN/cache strategy cho asset nang va 3D files.

# 5. Co the deploy bay gio khong?

## Cau tra loi ngan

**Co the deploy de test noi bo/staging. Chua nen deploy public production ngay.**

## Ly do

- Ve tinh nang, du an da du de chay va demo.
- Ve kien truc, FE/BE/CMS/admin da co that.
- Nhung o goc nhin production public, repo van con nhung diem "chua khoa cua":
  swagger public, seed credential visible, seed destructive, content hardcode chua dong bo CMS, va chua co nghiem thu van hanh staging du day.

# 6. Muc san sang hien tai

## San sang cho

- Demo khach hang.
- Noi bo nghiem thu.
- Staging deploy.
- Tiep tuc bo sung content va admin workflow.

## Chua san sang hoan toan cho

- Public production deploy khong can sua them.
- Van hanh dai han voi quy trinh noi dung chuan CMS.
- Ban giao cho team khac van hanh ma khong can huong dan them.

# 7. Kiem chung da co trong turn nay

- Da doc tong the repo frontend va backend.
- Da doi chieu docs hien tai voi code thuc te.
- Da xac nhan frontend co rewrite `/api/v1/*` sang backend.
- Da xac nhan frontend SEO test `npm test` trong `frontend` dang PASS.
- Da tam dung cac buoc build/lint/test khac theo yeu cau user, nen chua ket luan PASS/FULL cho toan bo pipeline.

# 8. Ket luan chung

Danh gia thang va thuc te:

- Du an hien tai **co nen tang tot**, nhin ra duoc huong san pham ro rang va da co gia tri su dung that.
- Phan manh nhat la: da co website public, du an showcase, form lead, admin dashboard, CMS foundation, auth, backend CRUD.
- Phan can lam tiep khong phai "viet lai tu dau", ma la **hardening + dong bo CMS + chuan hoa deploy**.

Neu uu tien dung, du an nay co the duoc day len staging ngay, sau do chot mot vong P0 ngan truoc khi mo public.
# 0. Cap nhat sau dot nang cap gan nhat

## Nhung nang cap da thuc hien

- Da bo sung workflow content cho CMS page: `draft -> in_review -> approved -> published`.
- Da them `site_page_version` de giu snapshot live va tach noi dung dang soan voi noi dung public dang hien thi.
- Da them `content_audit_log`; `BusinessEventsService` hien tai vua log o app layer vua ghi audit trail vao database.
- Da them endpoint workflow cho `site-content`: submit review, request changes, approve, publish.
- Da nang cap admin content page de co the dieu khien workflow, nhap `workflow notes`, theo doi version/status page va tao nhanh template JSON cho section marketing.
- Da chuyen `dich-vu`, `du-an`, `thiet-ke-website` sang bo render marketing moi, uu tien doc data tu CMS thay vi hardcode section.
- Da bo `images.unoptimized = true`, them `remotePatterns` cho Next.js va thay nhieu `img` bang `next/image`.
- Da bo sung lop sanitize cho FAQ/noi dung hien thi nguoi dung, bao gom normalize plain text tu CMS truoc khi render.
- Da bo sung semantic token co ban cho mau sac, section surface, border, shadow va spacing.
- Swagger da duoc dat dieu kien tat tren production.
- Da them guard cho seed script: chan trong production va yeu cau `ALLOW_DESTRUCTIVE_SEED=true` do script co xoa du lieu.
- Da siep workflow backend de tranh publish tat va de giai doan review/approve co y nghia nghiep vu hon.

## Hien trang sau nang cap

- Public site da tien gan hon mo hinh CMS-driven site; ba trang marketing chinh `dich-vu`, `du-an`, `thiet-ke-website` hien doc chung qua resolver marketing va van co fallback an toan neu CMS chua day du.
- Admin da dieu khien duoc nhieu hon doi voi noi dung public, nhung workflow/versioning hien van tap trung vao `SitePage/PageSection/FaqItem`, chua mo rong ra toan bo `product`, `showcase_item`, `site_setting`.
- Rui ro backend giam di nho swagger chi mo ngoai production, workflow publish duoc siep chat va seed script co guard an toan hon.
- Chua co buoc kiem chung moi cho lint/test/build trong dot cap nhat nay vi da tam dung theo yeu cau khong chay build/test; cac ket qua pass duoc nhac trong docs la ket qua tu dot truoc.

## Kiem tra lai cac yeu cau duoc doi chieu voi code

- Yeu cau "Chuyen cac trang marketing chinh sang render tu CMS/admin data, giam hardcode va bo sung resolver dung chung": da hoan thanh cho `dich-vu`, `du-an`, `thiet-ke-website`.
- Yeu cau "Thay img bang next/image, siet sanitize HTML, lam ro design tokens va cap nhat admin content actions": da hoan thanh o muc marketing core; van con mot so diem `<img>` phu/legacy ngoai luong uu tien.
- Yeu cau "Chay lint/test lien quan va ra soat diff de chot ket qua": chua thuc hien trong turn nay theo dung yeu cau khong chay build/test; chi ra soat code va docs.

# 9. Cap nhat 2026-04-01

## Nhung viec da chot them trong dot nay

- Da xu ly dut diem diem `<img>` legacy trong frontend runtime bang cach chuyen `ImageWithFallback` sang `next/image`.
- Da mo rong token giao dien de phu hon cho public/admin shared UI; footer va nhom admin shell/component dung chung da bat dau bo hardcode theo mot he token thong nhat hon.
- Da bo sung lop an toan cho cac diem inject co chu dich: JSON-LD schema script duoc serialize an toan, chart inline style duoc sanitize truoc khi render.
- Da noi actor workflow content vao auth context de `createdBy`, `updatedBy`, `approvedBy`, `publishedBy` co gia tri truy vet danh tinh thay vi chi dung log metadata.
- Da viet lai `backend/README.md` va don `configuration.ts` de tai lieu/cau hinh backend khop voi he thong hien tai.

## Nhung gi van co y nghia ton dong

- Swagger van chi duoc xac nhan qua code path non-production; chua co build/runtime verify trong turn nay.
- Test backend van ton tai trong repo nhung chua duoc chay lai de chot muc do dong bo voi code sau cung.
- Login seed credential, env production, backup/monitoring va vong nghiem thu staging van la cac hang muc ban can tiep tuc tu giai doan hardening.
