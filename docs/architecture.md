## 3. Backend architecture
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
