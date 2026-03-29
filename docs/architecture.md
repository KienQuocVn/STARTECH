

## 2. Trang thai frontend
### Con thieu

- UI CRUD thuc te trong dashboard cho tat ca module admin.
- Test metadata/SEO routes.
- Dependency cleanup review cho bo UI/Radix.

---

## 3. Backend architecture

### Con thieu

- Logging business event sau hon.
- Refactor nhieu service cu sang pattern exception + mapper nhat quan.
- Permission granularity vuot qua role co ban.

---

## 4. Database architecture
### Van can tiep tuc

- Legacy model naming van chua chuan PascalCase dong bo.
- Chua tach ro hon portfolio/project/content ownership khi CMS mo rong.
- Chua co permission/activity log tables neu sau nay can workflow phuc tap hon.

---

## 5. Ket luan kien truc
Buoc tiep theo cua kien truc la day giao dien admin thuc chien va production readiness:

- UI CMS,
- CI/CD,
- monitoring,
- caching/CDN strategy,
- cleanup va standardization phan code legacy.
