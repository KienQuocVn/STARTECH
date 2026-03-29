## 3. Backend architecture

### Cap nhat

- Da co permission matrix/guard de kiem soat theo capability, khong chi dung enum role thuan.
- Da co `BusinessEventsService` ghi log business event co cau truc cho auth, contact, content, product, pricing, showcase, settings, services, feedback.
- `site-settings` module da cho phep admin `settings` doc/ghi du lieu that tu `SiteSetting`.
- `services` da co CRUD admin thay vi chi read-only.
- `pricing-plan` da ho tro `featureNames` de FE co the gui feature theo ten, backend tu resolve/create khi can.

### Con thieu

- Refactor nhieu service cu sang pattern exception + mapper nhat quan.
- Bo backend unit test/spec legacy van chua theo kip schema va service hien tai.
- Workflow publish/content approval van chua tach thanh lifecycle rieng.

---

## 4. Database architecture

### Van can tiep tuc

- Legacy model naming van chua chuan PascalCase dong bo.
- Chua tach ro hon portfolio/project/content ownership khi CMS mo rong.
- Chua co permission/activity log tables neu sau nay can workflow admin phuc tap hon, du application layer da co permission matrix + business log baseline.

---

## 5. Ket luan kien truc

- can tiep tuc backend test debt, dua permission/logging xuong tang DB, va hoan thien production observability/alerting.
