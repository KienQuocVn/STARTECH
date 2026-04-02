# STARTECH Backend - Checklist Bảo Mật & Triển Khai

## Sửa Lỗi Bảo Mật P0 (Nghiêm Trọng) - TRƯỚC KHI PHÁT HÀNH CÔNG KHAI

### ✅ #1 Quản Lý JWT Secret

**Trạng thái**: ĐÃ SỬA  
**Thay đổi**:

- Thêm hàm xác thực trong `src/config/configuration.ts`
- Ném lỗi nếu `NODE_ENV=production` và thiếu `JWT_SECRET`
- Bao gồm cảnh báo độ dài tối thiểu (khuyến nghị 32 ký tự)

**Xác minh**:

```bash
# Kiểm tra chế độ production ném lỗi
NODE_ENV=production npm run start
# Kết quả mong đợi: Error: CRITICAL: JWT_SECRET environment variable must be set...

# Kiểm tra với secret đã được set
NODE_ENV=production JWT_SECRET=my-super-secret-key-32-chars npm run start
# Kết quả mong đợi: Server khởi động thành công
```

---

### ✅ #2 Bảo Mật Tài Liệu Swagger API

**Trạng thái**: ĐÃ XÁC MINH  
**Code hiện tại**: `if (!isProduction) { SwaggerModule.setup(...) }`

**Các bước xác minh**:

```bash
# 1. Build dự án
npm run build

# 2. Kiểm tra chế độ development (Swagger phải KHẢ DỤNG)
NODE_ENV=development npm run start:prod
curl http://localhost:3001/api/docs
# Kết quả mong đợi: 200 OK với Swagger UI

# 3. Kiểm tra chế độ production (Swagger phải BỊ CHẶN)
NODE_ENV=production JWT_SECRET=test-secret npm run start:prod
curl http://localhost:3001/api/docs
# Kết quả mong đợi: 404 Not Found

# 4. Kiểm tra thay thế - xem output console
npm run start:dev
# Console phải hiển thị: "Swagger docs at http://localhost:3001/api/docs" (không phải production)

NODE_ENV=production JWT_SECRET=test-secret npm run start:prod
# Console KHÔNG được hiển thị URL Swagger
```

**Checklist**:

- [ ] Flag `isProduction` được set đúng dựa trên `NODE_ENV`
- [ ] Không có import `@nestjs/swagger` bên ngoài block `if (!isProduction)`
- [ ] Test trả về 404 trên endpoint Swagger khi NODE_ENV=production

---

### ✅ #3 An Toàn Script Seed

**Trạng thái**: ĐÃ SỬA  
**Thay đổi**:

- Xóa hardcoded email admin (`kieukienquocbusiness@gmail.com`)
- Xóa fallback mật khẩu hardcoded (`Startech@2026`)
- Bây giờ yêu cầu biến môi trường rõ ràng: `ADMIN_EMAIL` và `ADMIN_PASSWORD`
- Thêm đếm ngược cảnh báo 3 giây trước các thao tác phá hủy dữ liệu

**Xác minh**:

```bash
# Test 1: Thử không có biến môi trường (phải thất bại)
ALLOW_DESTRUCTIVE_SEED=true npm run seed
# Kết quả mong đợi: Error: REQUIRED: Admin credentials missing for seed

# Test 2: Với biến môi trường đúng (phải thành công)
ALLOW_DESTRUCTIVE_SEED=true \
ADMIN_EMAIL=admin@test.local \
ADMIN_PASSWORD=MyStrongPassword2026 \
npm run seed
# Kết quả mong đợi: Seed hoàn thành, hiển thị thông tin đăng nhập trong output

# Test 3: Với mật khẩu ngắn (phải thất bại)
ALLOW_DESTRUCTIVE_SEED=true \
ADMIN_EMAIL=admin@test.local \
ADMIN_PASSWORD=short \
npm run seed
# Kết quả mong đợi: Error: Security: Admin password must be at least 8 characters
```

**Checklist**:

- [ ] Không có email mặc định hardcoded trong code
- [ ] Không có mật khẩu mặc định hardcoded trong code
- [ ] Cả ADMIN_EMAIL và ADMIN_PASSWORD đều bắt buộc
- [ ] Thông báo cảnh báo hiển thị khi chạy destructive seed
- [ ] Seed bị chặn trên production với thông báo lỗi rõ ràng

---

### ✅ #4 Template Biến Môi Trường

**Trạng thái**: ĐÃ SỬA  
**Các file đã cập nhật**:

- `backend/.env.example` - Cập nhật với tài liệu đầy đủ
- `frontend/.env.example` - Cập nhật với tài liệu đầy đủ

**Checklist**:

- [ ] Backend `.env.example` liệt kê tất cả biến bắt buộc
- [ ] Backend `.env.example` bao gồm cảnh báo production
- [ ] Frontend `.env.example` liệt kê tất cả biến bắt buộc
- [ ] Cả hai file đều có ví dụ và giải thích
- [ ] Hướng dẫn developer copy `.env.example` sang `.env`

---

## Sửa Lỗi P1 (Quan Trọng) - TRƯỚC KHI LÊN PRODUCTION

### 1. Xác Minh Bộ Test Backend

```bash
# Chạy tất cả test backend
npm run test

# Chạy e2e tests (auth, CRUD, validation)
npm run test:e2e

# Tạo báo cáo coverage
npm run test:cov
```

**Checklist**:

- [ ] Auth tests pass (đăng nhập, đăng xuất, refresh token)
- [ ] Product CRUD tests pass
- [ ] Validation tests pass
- [ ] Error handling tests pass
- [ ] Không có test bị lỗi do thay đổi code gần đây

### 2. Build Frontend & Kiểm Tra Bảo Mật

```bash
# Build production bundle
npm run build

# Chạy security audit
npm audit

# Kiểm tra cảnh báo console
npm run build 2>&1 | grep -i warning
```

**Checklist**:

- [ ] Frontend build không có lỗi
- [ ] Không có lỗ hổng npm nghiêm trọng
- [ ] Không có dependency deprecated
- [ ] Cảnh báo console đã được xử lý

### 3. Checklist Môi Trường Production

```bash
# Trước khi triển khai, xác minh các biến môi trường sau đã được set:
- NODE_ENV=production ✓
- JWT_SECRET=<secret-mạnh-và-duy-nhất> ✓
- DATABASE_URL=<db-production> ✓
- CORS_ORIGINS=<your-domain.com> ✓
- Tất cả thông tin SMTP (gửi email) ✓
- Rate limit API đã được cấu hình ✓
```

### 4. Xác Minh Sau Triển Khai

```bash
# Xác minh trên staging server:
1. Frontend tải không có lỗi
2. Đăng nhập hoạt động (thông tin đăng nhập admin đúng)
3. Có thể tạo/cập nhật/xóa sản phẩm
4. Có thể upload media
5. Đăng xuất chuyển hướng đúng
6. Refresh token rotation hoạt động
7. API base URL trỏ đúng đến backend
8. Swagger KHÔNG truy cập được tại /api/docs
9. Health check pass: GET /health
10. Rate limiting hoạt động trên public endpoints
```

---

## Hướng Dẫn Triển Khai

### Thiết Lập Phát Triển Cục Bộ

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy

# Seed với dữ liệu mẫu (chỉ dành cho dev)
ALLOW_DESTRUCTIVE_SEED=true \
ADMIN_EMAIL=admin@startech.local \
ADMIN_PASSWORD=DevPassword2026 \
npm run seed

npm run start:dev

# Frontend (trong terminal khác)
cd frontend
npm install
npm run dev
```

### Triển Khai Staging

```bash
# Backend
NODE_ENV=staging \
JWT_SECRET=<tạo-secret-mới> \
DATABASE_URL="mysql://..." \
CORS_ORIGINS="https://staging.startech.com" \
npm run build && npm run start:prod

# Frontend
NEXT_PUBLIC_API_BASE_URL=/api/v1 \
API_BASE_URL=http://backend-staging:3001 \
NEXT_PUBLIC_SITE_URL=https://staging.startech.com \
npm run build && npm run start
```

### Triển Khai Production

```bash
# 1. Set tất cả biến môi trường an toàn
export NODE_ENV=production
export JWT_SECRET=$(openssl rand -base64 32)  # Tạo secret mới
export DATABASE_URL="mysql://prod-user:pass@prod-host/startech"
export CORS_ORIGINS="https://startech.com,https://www.startech.com"
# ... set tất cả biến bắt buộc khác

# 2. Build backend
npm run build
npm run start:prod

# 3. Build frontend (tiến trình riêng biệt)
npm run build
npm run start

# 4. Xác minh health
curl https://startech.com/health
curl https://startech.com/api/v1/product

# 5. Chạy smoke tests
# Xem bộ test ở trên
```

---

## Kế Hoạch Rollback

Nếu có sự cố trong production:

```bash
# 1. Dừng triển khai hiện tại
pm2 stop startech-backend
pm2 stop startech-frontend

# 2. Khôi phục backup database trước đó
# (Giả sử backup tự động hàng ngày đã được cấu hình)
mysql -u root -p < /backups/startech-db.sql

# 3. Khởi động lại với phiên bản trước
pm2 restart startech-backend
pm2 restart startech-frontend

# 4. Xác minh health
curl https://startech.com/health
```

---

## Thiết Lập Monitoring & Cảnh Báo

Sau khi triển khai, theo dõi:

1. **Uptime**: Kiểm tra health endpoint mỗi 5 phút
2. **Tỷ lệ lỗi**: Cảnh báo nếu lỗi 5xx vượt quá 1% request
3. **Thời gian phản hồi**: Cảnh báo nếu thời gian phản hồi trung bình > 2 giây
4. **Kết nối Database**: Cảnh báo nếu không thể kết nối DB
5. **Dung lượng đĩa**: Cảnh báo nếu sử dụng đĩa > 80%
6. **Xác thực API**: Theo dõi các lần đăng nhập thất bại

Công cụ khuyến nghị:

- Datadog / New Relic cho APM
- Uptime Robot cho monitoring tính khả dụng
- AlertManager / PagerDuty cho on-call escalation

---

## Ứng Phó Sự Cố

Trong trường hợp sự cố bảo mật hoặc rò rỉ dữ liệu:

1. **Ngay lập tức**: Đưa ứng dụng offline nếu dữ liệu có nguy cơ
2. **Trong vòng 1 giờ**: Xoay vòng tất cả secret (JWT_SECRET, mật khẩu DB)
3. **Trong vòng 24 giờ**: Kiểm tra tất cả thay đổi (git log, database audit trail)
4. **Trong vòng 48 giờ**: Thông báo người dùng bị ảnh hưởng nếu dữ liệu cá nhân bị truy cập
5. **Trong vòng 1 tuần**: Post-mortem và kế hoạch khắc phục

---

## Bảo Trì Sau Khi Ra Mắt

### Hàng Ngày

- Kiểm tra error logs cho các vấn đề lặp lại
- Xác minh backup hoàn thành thành công

### Hàng Tuần

- Xem lại security audit logs
- Kiểm tra performance metrics (thời gian phản hồi, tỷ lệ lỗi)
- Xác minh backup (test restore)

### Hàng Tháng

- Xoay vòng secret và thông tin đăng nhập
- Cập nhật dependencies
- Xem lại CORS whitelist để loại bỏ các origin không cần thiết
- Load test để chuẩn bị cho lượng truy cập tăng đột biến

### Hàng Quý

- Security audit (OWASP Top 10, CWE)
- Kiểm thử xâm nhập (nếu là dịch vụ rủi ro cao)
- Tối ưu hóa database (xem lại index, phân tích query)
- Diễn tập phục hồi sau thảm họa

---

**Cập nhật lần cuối**: 02/04/2026  
**Chuẩn bị bởi**: Nhóm Phát Triển STARTECH  
**Lần xem xét tiếp theo**: Sau khi triển khai production