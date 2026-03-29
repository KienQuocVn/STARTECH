## 2. Nhung diem van can tiep tuc cai thien

### Backend

- Van con service return object thu cong o nhieu module cu.
- Logging business event da co baseline co cau truc, nhung chua den muc activity/audit log day du.
- Permission granularity da vuot role enum o application layer nho permission matrix, nhung chua co permission tables va delegation UI.
- Bo spec/unit test legacy chua duoc dong bo hoan toan voi service va schema moi.

### Database

- Legacy model naming van chua dong nhat PascalCase.
- Chua co activity log/permission tables cho workflow admin phuc tap hon.
- Chua tach ro hon semantics ownership giua project/portfolio/content khi CMS mo rong.

---

## 3. Uu tien tiep theo

### Uu tien 1

1. Chuan hoa backend test/spec legacy de CI backend co the gate chinh thuc.
2. Dua permission matrix hien tai xuong DB/table va mo rong thanh permission/activity log that.
3. Chot monitoring/alerting production vuot qua muc health check + business log baseline.

### Uu tien 2

1. Them business logging va activity log.
2. Tien toi permission granularity chi tiet hon.
3. Refactor service legacy.

### Uu tien 3

1. Production deploy docs.
2. Caching/CDN cho asset nang.
3. Backup/alerting.
4. Chuan hoa legacy naming.

---

Du an hien khong con vuong o bai toan "co admin hay chua" hay "admin con dung du lieu gia". Phan admin da chuyen sang van hanh voi live API, co baseline health/CI/SEO test, da co permission matrix va business-event logging co cau truc; bai toan con lai da ro hon: hardening backend, dua permission/logging xuong tang DB, monitoring production that va workflow approval.
