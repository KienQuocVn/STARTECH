# STARTECH Public Deploy Audit

## 1. Muc tieu

Tai lieu nay tong hop:

- nhung gi da duoc sua trong dot review hien tai
- danh gia UX/UI, responsive, SEO, bo cuc, mau sac
- danh gia bao mat va muc do san sang public deploy
- danh sach task uu tien gan de public cho khach hang

## 2. Nhung gi da duoc lam trong dot nay

### Da sua trong code

- Sua loi `admin/portfolio` khong load du lieu do frontend gui `limit=200` trong khi backend chi chap nhan toi da `100`.
- Them helper lay toan bo portfolio theo nhieu trang de admin va sitemap khong bi gioi han 100 item.
- Sua `sitemap.xml` de lay du lieu portfolio an toan, khong bi `400` validation.
- Bo `eslint.ignoreDuringBuilds` va `typescript.ignoreBuildErrors` khoi `frontend/next.config.mjs` de frontend quay lai build theo loi that.
- Chuyen login/logout admin sang session flow qua `frontend/app/api/admin/session/route.ts`, set cookie thay vi ghi token vao `localStorage`.
- Cap nhat backend `JwtStrategy` de nhan JWT tu cookie `startech_admin_token`, khong chi tu header Bearer.
- Bo sung `Content-Security-Policy` co ban trong `frontend/middleware.ts`.
- Tao component dung chung `ConversionBand` va gan vao `trang-chu`, `dich-vu`, `du-an` de CTA "Nhan bao gia" / "Dat lich tu van" va trust signal nhat quan hon.
- Chuan hoa them token brand trong `frontend/app/globals.css` gom:
  - `--brand-primary`
  - `--brand-secondary`
  - `--brand-surface`
  - `--brand-gradient`
- Tao skeleton loading moi cho cac route co `loading.tsx` va ap dung `animate-pulse`.
- Dong bo palette xanh duong theo 2 mau chu dao:
  - `#1a63a8`
  - `#80d8f9`
- Bo sung token mau `brand-*` de admin UI dung dung mau va de maintain hon.
- An nut hamburger tren desktop o navbar de bo cuc sach hon.
- Them mot lop response security headers trong Next middleware.
- Gioi han upload media: chi cho phep hinh anh va toi da `5MB`.

### Da verify

- Frontend lint: `PASS` nhung con warning ve `img`, `alt`, va mot so bien chua dung.
- Frontend SEO metadata test: `PASS`
- Backend build: `PASS`
- Backend lint: `PASS` voi `1` warning legacy chua dung (`contact.service.spec.ts`).
- Frontend production build: `PASS`
  - Build production da chay xong thanh cong.
  - Con nhieu warning production lien quan den `img`, `alt`, va bien khong dung, can don tiep de toi uu chat luong runtime/SEO.

### Luu y quan trong

Frontend da duoc tra ve che do build nghiem tuc hon:

- khong con `eslint.ignoreDuringBuilds`
- khong con `typescript.ignoreBuildErrors`

Hien tai da co bang chung `frontend build`, `backend build` va `frontend SEO test` chay duoc. Van con nhom warning va hardening task can don tiep neu muon public production an toan hon.

## 3. Danh gia hien trang

### UX/UI va bo cuc

Danh gia tong quan: kha tot, nhung chua dong nhat hoan toan.

Diem on:

- Co cau truc trang ro: hero, gia tri, showcase, quy trinh, FAQ, CTA.
- Co nhieu section chia thong tin dung logic cho dich vu thiet ke website.
- Co portfolio, testimonial, bang gia, FAQ, contact nen phu hop hanh vi khach hang tim dich vu.

Diem chua on:

- Da co them brand token va mot block CTA/trust dung chung, nhung van con mot so section public dung mau hardcode / tone teal cu.
- Motion va gradient da bot roi rac hon, nhung van chua duoc chuan hoa toan bo tren moi trang.
- Chua refactor het nhom component cu sang design token moi, nen tinh dong nhat thuong hieu moi o muc "mot phan".

### Than thien nguoi dung va de su dung

Danh gia tong quan: than thien, nhung can toi uu them cho hanh trinh chuyen doi.

Diem on:

- CTA xuat hien ro.
- Danh sach dich vu va du an de hieu.
- Trang du an co bo loc, phu hop nguoi dung muon xem theo nhom.
- Loading skeleton moi giup cam giac load tot hon va giam "nhay layout".

Diem can cai thien:

- Da bo sung CTA "Nhan bao gia" / "Dat lich tu van" va trust signal co ban tren `trang-chu`, `dich-vu`, `du-an`.
- Van can tiep tuc day social proof that hon nhu logo khach hang, doi tac, case study co so lieu that.
- Microcopy da duoc lam gon hon o block conversion moi, nhung cac section cu van con can chinh lai them.

### Responsive

Danh gia tong quan: da co nen tang responsive, nhung chua nen xem la da test day du moi thiet bi.

Diem on:

- Phan lon section da co class `sm/md/lg`.
- Da tach mot so asset 3D mobile/desktop.
- Menu mobile rieng da ton tai.

Rui ro con lai:

- Chua co bang chung test thuc te tren nhieu breakpoint va trinh duyet.
- Asset 3D, anh lon, slider, section cao co the gay jank tren mobile cau hinh trung binh.
- Chua thay tai lieu test responsive cho `tablet/iPad landscape`, `small mobile`, `large desktop`.

Ket luan:

- Co the dung tot tren nhieu kich thuoc pho bien.
- Chua du can cu de khang dinh "toi uu cho moi loai thiet bi" neu chua test thuc te.

### Mau sac va thuong hieu

Danh gia tong quan: huong di dung, can chuan hoa them.

- Mau chu dao xanh duong `#1a63a8` va xanh nhat `#80d8f9` phu hop linh vuc cong nghe, dich vu website, tao cam giac tin cay.
- Dot nay da dua palette nay vao token trung tam.
- Van can buoc tiep theo: refactor cac gia tri mau hardcode rai rac thanh design tokens de tranh lech tone.

### SEO

Danh gia tong quan: co nen tang kha tot, nhung chua toi uu hoan tat.

Diem on:

- Co metadata theo trang.
- Co canonical, Open Graph, Twitter card.
- Co `robots.ts`, `sitemap.ts`.
- Co FAQ schema va LocalBusiness schema.
- Build sitemap da duoc sua de khong bi fail khi portfolio lon.

Diem thieu:

- Chua thay quy trinh audit Core Web Vitals that.
- Chua thay kiem soat chat heading hierarchy tren toan bo page.
- Chua co quy trinh anh SEO dong bo: kich thuoc, alt text, preload/prioritize anh quan trong.
- Frontend khong con bo qua type-check/lint trong build, nhung van con warning can xu ly de chat luong SEO/runtime sach hon.

### Bao mat va kha nang chong tan cong

Danh gia tong quan: co nen tang co ban, chua du de ket luan "an toan cao" neu public traffic lon.

Diem on:

- Backend co `helmet`, `compression`, validation pipe, whitelist, forbidNonWhitelisted.
- Backend co throttling toan cuc va strict rate limit cho auth/contact.
- Co JWT auth, role guard, permission guard.
- Refresh token duoc hash trong database.
- Dot nay da bo sung:
  - security headers o frontend
  - file upload allowlist va file-size limit

Rui ro chua xu ly xong:

- Luong auth admin da duoc doi sang cookie-based session flow trong code, nhung can verify them e2e toan bo CRUD admin sau khi restart app.
- Dang login admin hien van prefill va hien thi tai khoan seed/mac dinh tren UI, khong phu hop khi public.
- Seed backend van co fallback password mac dinh neu khong truyen env, tao rui ro neu van hanh production sai quy trinh.
- JWT secret van co fallback `startech-dev-secret` trong auth module/service/strategy, khong nen giu cho production.
- Swagger dang public mac dinh tai `/api/docs`, can tat hoac gioi han truy cap tren moi moi truong public.
- Da co CSP co ban, nhung chua phai CSP hardening day du cho moi script/asset third-party.
- Chua thay WAF/CDN/chong bot o tang public edge.
- Chua thay backup/restore test chinh thuc.
- Chua thay monitoring, alerting, log dashboard, audit trail hoan chinh.
- Chua co tai lieu incident response neu bi tan cong.

Ket luan bao mat:

- Muc do hardening da tot hon so voi truoc nho session cookie va CSP co ban.
- Tuy nhien van chua the cam ket muc "an toan cao" neu chua co verify e2e auth, CSP day du, CDN/WAF, backup, monitoring va quy trinh van hanh su co.

## 4. Danh sach task de public gan

### P0 - Bat buoc truoc khi public

1. Chay lai verify day du sau khi restart app:
   - frontend production build
   - backend build
   - login/admin CRUD e2e voi luong cookie moi
   Muc tieu: xac nhan nhung thay doi da on dinh that, khong chi dung o muc sua code.

2. Loai bo seed credentials va dev fallback truoc khi public.
   Muc tieu: khong prefill/hien mat khau tren UI, khong fallback `JWT_SECRET`, khong fallback password admin trong production path.

3. Chuan hoa env production.
   Muc tieu: dat `JWT_SECRET`, `CORS_ORIGINS`, `NEXT_PUBLIC_SITE_URL`, SMTP, DB secret dung chuan.

4. Dong Swagger hoac gioi han truy cap `/api/docs` tren moi truong public.
   Muc tieu: giam lo thong tin API surface va flow auth cho nguoi ngoai.

5. Dung CDN/WAF truoc frontend va backend.
   Muc tieu: giam rui ro DDoS, bot spam, abuse traffic.

6. Thiet lap backup database va quy trinh restore.
   Muc tieu: khong mat du lieu khi co su co.

7. Test responsive that tren:
   - iPhone SE / 390px
   - iPhone Pro Max
   - iPad / iPad Pro
   - laptop 1366px
   - desktop 1440px+
   Muc tieu: xac nhan UI khong vo layout, CTA khong bi che, text khong tran.

### P1 - Nen lam ngay sau P0

1. Chuan hoa design token va loai bo mau hardcode rai rac.
   Muc tieu: giao dien dong nhat, de maintain, de them dark/light neu can.

2. Audit anh va asset 3D, uu tien thay `img` bang `next/image` o nhung section public quan trong.
   Muc tieu: giam dung luong, cai thien LCP/CLS/INP tren mobile.

3. Mo rong CSP va security review cho upload, auth, admin routes.
   Muc tieu: tang hardening muc ung dung sau khi da co lop CSP co ban.

4. Bo sung analytics + monitoring + alerting.
   Muc tieu: biet ngay khi site loi, API loi, lead form loi.

5. Them social proof that va CTA conversion ro hon.
   Muc tieu: tang ti le lien he/bao gia, bo sung case study / logo khach hang / cam ket ro hon.

### P2 - Nang cap gan

1. Viet bo regression checklist cho tung page public.
2. Thiet lap CI/CD co build, lint, type-check, smoke test.
3. Tao dashboard bao cao lead, hieu qua showcase, conversion funnel.
4. Toi uu content SEO theo tu khoa dich vu va khu vuc muc tieu.

## 5. Checklist deploy public

### Ha tang

- Domain va SSL da cau hinh dung.
- Reverse proxy/Nginx hoac platform config da bat HTTPS.
- CDN/WAF da bat.
- Database production da backup tu dong.
- Log va monitoring da bat.

### Frontend

- `NEXT_PUBLIC_SITE_URL` dung domain that.
- Build thanh cong.
- `robots.txt` tra ve dung.
- `sitemap.xml` tra ve dung.
- Metadata title/description/canonical/OG dung tren cac page chinh.
- Responsive da test tren mobile/tablet/desktop.

### Backend

- `JWT_SECRET` da thay secret manh.
- `CORS_ORIGINS` chi cho phep domain can thiet.
- Swagger khong public neu khong can.
- Rate limit dang bat.
- Upload media co allowlist va gioi han size.

### Van hanh

- Co tai khoan admin production rieng.
- Password admin manh va khong dung lai.
- Co ke hoach xu ly su co va rollback.
- Co nguoi theo doi log trong 24-72h dau sau deploy.

## 6. Ket luan ngan

Du an hien tai da dat muc co the build va dong goi production cho frontend/backend. Tuy nhien o goc do public deploy that, van chua nen ket luan "san sang dua len web" cho den khi xu ly xong 4 nhom blocker chinh: bo tai khoan seed/dev fallback, dong hoac gioi han Swagger public, verify auth/admin e2e, va hoan thien lop van hanh production (WAF/CDN, backup, monitoring, responsive test that).
