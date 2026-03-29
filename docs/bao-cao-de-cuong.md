## 3. Nhung diem van can tiep tuc cai thien

### Frontend

- Chua co UI CRUD day du trong dashboard admin.
- Chua co test cho route metadata/SEO.
- Chua co dependency cleanup review toan bo bo UI/Radix.

### Backend

- Van con service return object thu cong o nhieu module cu.
- Logging business event chua sau.
- Permission granularity van dung enum role co ban.

### Database

- Legacy model naming van chua dong nhat PascalCase.
- Chua co activity log/permission tables cho workflow admin phuc tap hon.

---

## 4. Uu tien tiep theo

### Uu tien 1

1. Gan UI CRUD cho `SitePage`, `PageSection`, `FaqItem`, `contact_submission`.
2. Gan UI CRUD cho product/category/showcase/pricing/feedback.
3. Them test cho metadata/SEO routes.

### Uu tien 2

1. Monitoring.
2. CI/CD.
3. Production deploy docs.

### Uu tien 3

1. Cleanup dependency UI.
2. Refactor service legacy.
3. Chuan hoa naming schema theo lo trinh migration an toan.

---

## 5. Ket luan

Dot nay du an da dich ro tu "co website + seed" sang "co nen admin/CMS that". Phan viec con lai khong nam o auth hay route nua, ma nam o:

- giao dien admin thuc chien,
- production discipline,
- cleanup code legacy.
