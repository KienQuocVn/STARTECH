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
- Tao skeleton loading moi cho cac route co `loading.tsx` va ap dung `animate-pulse`.
- Dong bo palette xanh duong theo 2 mau chu dao:
  - `#1a63a8`
  - `#80d8f9`
- Bo sung token mau `brand-*` de admin UI dung dung mau va de maintain hon.
- An nut hamburger tren desktop o navbar de bo cuc sach hon.
- Them mot lop response security headers trong Next middleware.
- Gioi han upload media: chi cho phep hinh anh va toi da `5MB`.

### Da verify

- Frontend SEO tests: `PASS`
- Backend build: `PASS`
- Frontend production build: `PASS`

### Luu y quan trong

Frontend van dang build voi:

- bo qua type validation
- bo qua linting

Do `frontend/next.config.mjs` dang bat:

- `eslint.ignoreDuringBuilds = true`
- `typescript.ignoreBuildErrors = true`

Day la diem can xu ly truoc khi xem la "production-ready" theo nghia chat luong code.

## 3. Danh gia hien trang

### UX/UI va bo cuc

Danh gia tong quan: kha tot, nhung chua dong nhat hoan toan.

Diem on:

- Co cau truc trang ro: hero, gia tri, showcase, quy trinh, FAQ, CTA.
- Co nhieu section chia thong tin dung logic cho dich vu thiet ke website.
- Co portfolio, testimonial, bang gia, FAQ, contact nen phu hop hanh vi khach hang tim dich vu.

Diem chua on:

- Visual language chua dong nhat 100%, vi mot so section van dung tone teal/cu va mot so section dung xanh duong moi.
- Nhieu component dang hardcode mau truc tiep trong JSX, ve sau se kho maintain.
- Motion va gradient co nhieu phong cach khac nhau giua cac trang, can chuan hoa them de nhin "mot thuong hieu".
- Admin UI truoc do co dung class `brand-*` nhung chua co token trung tam, da duoc bo sung trong dot nay.

### Than thien nguoi dung va de su dung

Danh gia tong quan: than thien, nhung can toi uu them cho hanh trinh chuyen doi.

Diem on:

- CTA xuat hien ro.
- Danh sach dich vu va du an de hieu.
- Trang du an co bo loc, phu hop nguoi dung muon xem theo nhom.
- Loading skeleton moi giup cam giac load tot hon va giam "nhay layout".

Diem can cai thien:

- Can bo sung CTA "Nhan bao gia" / "Dat lich tu van" nhat quan hon o cuoi cac section quan trong.
- Can co trust signal manh hon: quy trinh, cam ket, SLA, bao hanh, doi tac, logo khach hang that.
- Can toi uu microcopy o mot so noi dung de ngan gon va tap trung vao loi ich kinh doanh hon.

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
- Frontend dang bo qua type-check va lint trong build, de sot loi SEO/runtime.

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

- Access token admin dang luu trong `localStorage`, de bi rui ro neu xay ra XSS.
- Chua thay CSP policy day du.
- Chua thay WAF/CDN/chong bot o tang public edge.
- Chua thay backup/restore test chinh thuc.
- Chua thay monitoring, alerting, log dashboard, audit trail hoan chinh.
- Chua co tai lieu incident response neu bi tan cong.

Ket luan bao mat:

- Khong co dau hieu "mo toang" hay rat de bi hack ngay lap tuc.
- Tuy nhien chua the cam ket "khong bi hacker danh cap du lieu" hoac "khong bi DDoS" neu chua co cac lop bao ve ha tang nhu CDN, WAF, rate-limit edge, backup, monitoring, secret rotation.

## 4. Danh sach task de public gan

### P0 - Bat buoc truoc khi public

1. Bo type-ignore va lint-ignore trong `frontend/next.config.mjs`.
   Muc tieu: build fail khi code loi that, tranh deploy code loi len production.

2. Chuyen admin auth tu `localStorage` sang `httpOnly secure cookie`.
   Muc tieu: giam rui ro token bi lay qua XSS.

3. Chuan hoa env production.
   Muc tieu: dat `JWT_SECRET`, `CORS_ORIGINS`, `NEXT_PUBLIC_SITE_URL`, SMTP, DB secret dung chuan.

4. Dung CDN/WAF truoc frontend va backend.
   Muc tieu: giam rui ro DDoS, bot spam, abuse traffic.

5. Thiet lap backup database va quy trinh restore.
   Muc tieu: khong mat du lieu khi co su co.

6. Test responsive that tren:
   - iPhone SE / 390px
   - iPhone Pro Max
   - iPad / iPad Pro
   - laptop 1366px
   - desktop 1440px+
   Muc tieu: xac nhan UI khong vo layout, CTA khong bi che, text khong tran.

### P1 - Nen lam ngay sau P0

1. Chuan hoa design token va loai bo mau hardcode rai rac.
   Muc tieu: giao dien dong nhat, de maintain, de them dark/light neu can.

2. Audit anh va asset 3D.
   Muc tieu: giam dung luong, cai thien LCP/CLS/INP tren mobile.

3. Bo sung CSP va security review cho upload, auth, admin routes.
   Muc tieu: tang hardening muc ung dung.

4. Bo sung analytics + monitoring + alerting.
   Muc tieu: biet ngay khi site loi, API loi, lead form loi.

5. Them social proof that va CTA conversion ro hon.
   Muc tieu: tang ti le lien he/bao gia.

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

Du an hien tai da co nen tang kha tot de demo va tien toi public, dac biet sau khi da sua loi portfolio, sitemap, loading skeleton va bo sung mot so hardening co ban. Tuy nhien de tu tin public cho khach hang vao xem o muc "san sang van hanh", van con mot nhom viec P0 lien quan den type/lint enforcement, auth storage, WAF/CDN, backup va test responsive thuc te can hoan tat.
