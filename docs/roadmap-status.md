## Phase 3 - Backend Hardening & Frontend Standards
### Cap nhat

- [~] Legacy model naming van chua duoc chuan hoa tron ven.
  Application layer da duoc bo sung permission matrix va business-event logging, nhung schema legacy (`product`, `services`, `contact_submission`...) van chua duoc migration dong bo sang naming PascalCase.

---

## Phase 4 - Dynamic Content & Admin Foundation

### Cap nhat

- [~] Permission granularity vuot qua enum role co ban.
  Da co permission matrix (`product.write`, `content.delete`, `settings.read`...) va guard check theo permission ben canh role.
  Chua co permission tables trong DB va chua co UI quan tri permission dong.
- [~] Refactor dan service cu dang return object thu cong.
  Cac module admin moi cham den da duoc day ve pattern exception/structured response ro hon, nhung nhieu service legacy van can refactor tiep.
- [ ] Hoan thien workflow publish/content approval neu can.
  Hien tai admin da CRUD truc tiep du lieu that va co `isActive` cho section/faq, nhung chua co workflow approve/publish rieng theo role o cap page/content lifecycle.

---

## Phase 5 - CMS & Production Hardening

### Dang tiep tuc

- [~] Production deploy docs.
  Da co `docs/public-deploy-audit.md` va checklist deploy co ban.
  Van can bo sung tai lieu env production, rollback, WAF/CDN, va cach tat/gioi han Swagger khi public.
- [ ] CDN/caching strategy cho asset nang va `.spline`.
- [~] Monitoring, backup, alerting.
  Da co `/health` cho backend, `/api/health` cho frontend va `BusinessEventsService` de lam baseline smoke/uptime/business log.
  Alerting, dashboard observability, backup va on-call production van chua duoc thiet lap.
- [~] Build verification.
  Frontend production build, frontend SEO metadata test va backend build da chay duoc.
  Van can don warning frontend (`img`, `alt`, bien khong dung) va bo sung auth/admin e2e smoke test.
- [ ] Production security cleanup.
  Can loai bo seed credentials khoi login UI, bo fallback `JWT_SECRET` / admin password trong production path, va dong hoac gioi han `/api/docs`.

### Ghi chu kiem chung

- Frontend SEO metadata test script: `npm --prefix frontend test`
- Frontend production build: `npm --prefix frontend run build`
- Frontend type-check: `npx --prefix frontend tsc --noEmit -p frontend/tsconfig.json`
- Backend build: `npm --prefix backend run build`
- Backend lint: `npm --prefix backend run lint`
- Backend unit test hien van do do bo spec legacy chua duoc cap nhat dong bo voi codebase moi.

---
