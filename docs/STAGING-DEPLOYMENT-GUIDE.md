# STARTECH - Hướng Dẫn Triển Khai Staging

## Checklist Trước Khi Triển Khai

### Chuẩn Bị Backend

```bash
cd backend

# 1. Cài đặt dependencies
npm install

# 2. Xác minh build
npm run build
# Kết quả mong đợi: Thư mục dist/ được tạo không có lỗi

# 3. Chạy linter
npm run lint
# Kết quả mong đợi: Không có lỗi nghiêm trọng

# 4. Chạy tests
npm run test
npm run test:e2e
# Kết quả mong đợi: Tất cả tests pass (hoặc các lỗi đã được ghi lại)

# 5. Xác minh Swagger build đúng
npm run build
# Kiểm tra code - Swagger chỉ nên build cho môi trường không phải production

# 6. Xác minh thiết lập cấu hình
cat src/config/configuration.ts | grep -A 5 "validateJwtSecret"
# Kết quả mong đợi: Hàm ném lỗi khi thiếu SECRET trong production
```

### Chuẩn Bị Frontend

```bash
cd frontend

# 1. Cài đặt dependencies
npm install

# 2. Xác minh build
npm run build
# Kết quả mong đợi: Thư mục .next/ được tạo không có lỗi

# 3. Chạy linter
npm run lint
# Kết quả mong đợi: Không có cảnh báo nghiêm trọng

# 4. Chạy tests (SEO tests)
npm run test
# Kết quả mong đợi: Tests pass

# 5. Xác minh biến môi trường được sử dụng
grep -r "NEXT_PUBLIC_" src/ | head -20
# Kết quả mong đợi: Tất cả biến môi trường có tiền tố đúng
```

---

## Biến Môi Trường Staging

### Backend Staging (.env.staging)

```bash
# ========== MÔI TRƯỜNG ==========
NODE_ENV=staging
PORT=3001

# ========== DATABASE ==========
DATABASE_URL="mysql://staging_user:staging_password@staging-db.example.com:3306/startech_staging"

# ========== BẢO MẬT ==========
JWT_SECRET="tạo-secret-ngẫu-nhiên-mới-tối-thiểu-32-ký-tự-$(openssl rand -base64 32)"
CORS_ORIGINS="https://staging.startech.com,http://localhost:3000"

# ========== EMAIL ==========
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="staging@startech.com"
SMTP_PASS="staging-app-password"
SMTP_SECURE=true
FROM_NAME="STARTECH Staging"
FROM_EMAIL="noreply-staging@startech.com"

# ========== TÙY CHỌN ==========
LOG_LEVEL="info"
ALLOW_DESTRUCTIVE_SEED="false"
```

### Frontend Staging (.env.staging)

```bash
# ========== API ENDPOINTS ==========
NEXT_PUBLIC_API_BASE_URL=/api/v1
API_BASE_URL=http://staging-backend:3001
NEXT_PUBLIC_SITE_URL=https://staging.startech.com

# ========== ANALYTICS ==========
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_TELEMETRY_DISABLED=1
```

---

## Các Bước Triển Khai (Linux/Docker)

### Bước 1: Chuẩn Bị Staging Server

```bash
# SSH vào staging server
ssh deploy@staging-server.com

# Tạo thư mục ứng dụng
sudo mkdir -p /app/startech
cd /app/startech

# Clone/pull repository
git clone https://github.com/your-org/startech.git .
# hoặc: git pull origin main

# Xác minh tính toàn vẹn của code
git log --oneline -5  # Kiểm tra các commit mới nhất
git status            # Kiểm tra các thay đổi chưa commit
```

### Bước 2: Triển Khai Backend

```bash
cd backend

# Copy biến môi trường
cp /secure/.env.staging .env.production
# Hoặc set thủ công biến môi trường trong process manager production

# Cài đặt dependencies
npm ci  # Dùng ci thay vì install cho hành vi giống production hơn

# Tạo Prisma client
npx prisma generate

# Chạy database migrations
npx prisma migrate deploy
# Kết quả mong đợi: Migrations được áp dụng thành công

# Build backend
npm run build
# Kết quả mong đợi: dist/ được tạo, không có lỗi

# Xác minh output build
ls -la dist/
file dist/main.js
```

### Bước 3: Khởi Động Backend

**Tùy chọn A: Dùng PM2 (Khuyến nghị)**

```bash
npm install -g pm2

# Khởi động backend
pm2 start dist/main.js \
  --name "startech-backend" \
  --env NODE_ENV=production \
  --env JWT_SECRET="<your-secret>" \
  --env DATABASE_URL="<your-db-url>" \
  --env CORS_ORIGINS="https://staging.startech.com"

# Lưu cấu hình PM2 để tự khởi động lại
pm2 save
pm2 startup

# Theo dõi
pm2 logs startech-backend
pm2 status
```

**Tùy chọn B: Dùng Docker**

```bash
# Tạo Dockerfile trong backend/
cat > Dockerfile <<EOF
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]
EOF

# Build image
docker build -t startech-backend:latest .

# Chạy container
docker run -d \
  --name startech-backend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e JWT_SECRET="your-secret" \
  -e DATABASE_URL="your-db-url" \
  startech-backend:latest

# Xác minh
docker logs startech-backend
curl http://localhost:3001/health
```

### Bước 4: Triển Khai Frontend

```bash
cd ../frontend

# Copy biến môi trường
cp /secure/.env.staging .env.production

# Cài đặt dependencies
npm ci

# Build next.js
npm run build
# Kết quả mong đợi: .next/ được tạo, không có lỗi build

# Khởi động frontend
npm run start
# Hoặc dùng PM2:
pm2 start "npm run start" \
  --name "startech-frontend" \
  --env NODE_ENV=production

# Xác minh frontend đang chạy
curl http://localhost:3000
```

### Bước 5: Thiết Lập Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/startech-staging

upstream backend {
    server 127.0.0.1:3001;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 443 ssl http2;
    server_name staging.startech.com;

    # Chứng chỉ SSL (dùng Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/staging.startech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.startech.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads/ {
        alias /app/startech/backend/uploads/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}

# Chuyển hướng HTTP sang HTTPS
server {
    listen 80;
    server_name staging.startech.com;
    return 301 https://$server_name$request_uri;
}
```

Bật cấu hình nginx:

```bash
sudo ln -s /etc/nginx/sites-available/startech-staging /etc/nginx/sites-enabled/
sudo nginx -t  # Kiểm tra cấu hình
sudo systemctl restart nginx
```

---

## Bài Kiểm Tra Xác Minh Staging

### Kiểm Tra 1: Kết Nối API

```bash
# Kiểm tra health
curl https://staging.startech.com/health
# Kết quả mong đợi: 200 OK

# Kiểm tra Swagger (phải BỊ CHẶN)
curl https://staging.startech.com/api/docs
# Kết quả mong đợi: 404 Not Found

# Kiểm tra phiên bản API
curl https://staging.startech.com/api/v1/product
# Kết quả mong đợi: 200 OK với mảng sản phẩm
```

### Kiểm Tra 2: Render Frontend

```bash
# Kiểm tra trang chủ
curl https://staging.startech.com/
# Kết quả mong đợi: 200 OK với HTML chứa metadata

# Kiểm tra SEO tags
curl https://staging.startech.com/ | grep -i "og:title"
# Kết quả mong đợi: Có Open Graph tags
```

### Kiểm Tra 3: Luồng Xác Thực

**Kiểm thử thủ công (qua trình duyệt)**:

1. Truy cập https://staging.startech.com/login
2. Nhập thông tin đăng nhập admin đã set khi seed
3. Click "Đăng nhập"
4. Kết quả mong đợi: Chuyển hướng đến dashboard /admin
5. Xác minh đăng nhập vẫn tồn tại sau khi tải lại trang
6. Vào /admin/portfolio và xác minh có thể xem sản phẩm
7. Test đăng xuất → chuyển hướng về /login

**Kiểm thử API**:

```bash
# Đăng nhập
RESPONSE=$(curl -X POST https://staging.startech.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@startech.local","password":"YourPassword"}')

TOKEN=$(echo $RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"

# Test endpoint yêu cầu xác thực
curl https://staging.startech.com/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
# Kết quả mong đợi: 200 OK với thông tin người dùng
```

### Kiểm Tra 4: Thao Tác CRUD

**Tạo Sản Phẩm**:

```bash
curl -X POST https://staging.startech.com/api/v1/product \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sản Phẩm Test",
    "description": "Test",
    "image_url": "/product/test.png",
    "priceType": "CONTACT"
  }'
# Kết quả mong đợi: 201 Created với ID sản phẩm mới
```

**Upload Media**:

```bash
curl -X POST https://staging.startech.com/api/v1/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
# Kết quả mong đợi: 201 Created với đường dẫn file
```

**Danh Sách Sản Phẩm**:

```bash
curl https://staging.startech.com/api/v1/product?skip=0&take=10
# Kết quả mong đợi: 200 OK với sản phẩm phân trang
```

---

## Monitoring & Bảo Trì

### Thiết Lập Monitoring

```bash
# Cài đặt công cụ monitoring
npm install -g pm2-plus

# Kích hoạt PM2 Plus monitoring
pm2 plus

# HOẶC dùng script monitoring tùy chỉnh
cat > /app/startech/monitor.sh <<'EOF'
#!/bin/bash
while true; do
    # Kiểm tra backend
    if ! curl -s http://localhost:3001/health > /dev/null; then
        echo "❌ Backend down!"
        pm2 restart startech-backend
    fi

    # Kiểm tra frontend
    if ! curl -s http://localhost:3000/ > /dev/null; then
        echo "❌ Frontend down!"
        pm2 restart startech-frontend
    fi

    sleep 300  # Kiểm tra mỗi 5 phút
done
EOF

chmod +x /app/startech/monitor.sh
pm2 start /app/startech/monitor.sh --name "monitor"
```

### Quản Lý Log

```bash
# Xem logs
pm2 logs startech-backend
pm2 logs startech-frontend

# Lưu logs ra file
pm2 logs > /var/log/startech.log

# Xoay vòng logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:compress true
```

---

## Quy Trình Rollback

Nếu triển khai thất bại:

```bash
# 1. Dừng dịch vụ hiện tại
pm2 stop all

# 2. Quay lại code trước đó
git revert HEAD
git pull origin main

# 3. Dùng snapshot database trước đó
# (Giả sử backup đã tồn tại)
mysql startech_staging < /backups/startech_staging_$(date -d yesterday +%Y%m%d).sql

# 4. Khởi động lại dịch vụ
npm run build  # nếu cần
pm2 restart all

# 5. Xác minh health
curl https://staging.startech.com/health
```

---

## Baseline Hiệu Suất

Sau khi triển khai staging, thu thập các chỉ số baseline:

```bash
# Web Vitals (Lighthouse)
npx lighthouse https://staging.startech.com --output-path=/tmp/lighthouse.html

# Thời Gian Phản Hồi API
ab -n 100 -c 10 https://staging.startech.com/api/v1/product

# Thời Gian Kết Nối Database
npm run test:e2e -- --reporter=json > /tmp/test-results.json

# Chỉ Số Nginx Access
tail -100 /var/log/nginx/access.log | awk '{print $10}' | sort -n | tail -20
```

---

## Backup & Phục Hồi

### Backup Database

```bash
# Backup thủ công
mysqldump -u staging_user -p startech_staging > /backups/startech_staging_$(date +%Y%m%d_%H%M%S).sql

# Backup tự động hàng ngày (cron)
0 2 * * * /usr/bin/mysqldump -u staging_user -p$DB_PASS startech_staging | gzip > /backups/startech_staging_$(date +\%Y\%m\%d).sql.gz

# Khôi phục từ backup
mysql -u staging_user -p startech_staging < /backups/startech_staging_20260402.sql
```

### Backup Ứng Dụng

```bash
# Backup uploads
tar -czf /backups/uploads_$(date +%Y%m%d).tar.gz /app/startech/backend/uploads/

# Backup cấu hình môi trường (mã hóa)
gpg -c /app/startech/backend/.env.production
# Lưu thành .env.production.gpg
```

---

## Khắc Phục Sự Cố

### Backend không khởi động được

```bash
# Kiểm tra port đang sử dụng
lsof -i :3001

# Kiểm tra error logs
pm2 logs startech-backend --err

# Xác minh biến môi trường
env | grep JWT_SECRET
env | grep DATABASE_URL

# Test kết nối database
npm run test:db
```

### Frontend build thất bại

```bash
# Kiểm tra lỗi build
npm run build 2>&1 | tail -50

# Xác minh biến môi trường cho build time
echo $NEXT_PUBLIC_API_BASE_URL
echo $NEXT_PUBLIC_SITE_URL

# Xóa cache và thử lại
rm -rf .next node_modules
npm install && npm run build
```

### Database migration thất bại

```bash
# Kiểm tra trạng thái migration
npx prisma migrate status

# Nếu bị kẹt, reset (CẨN THẬN - chỉ dành cho staging!)
npx prisma migrate reset --skip-generate

# Áp dụng lại migrations
npx prisma migrate deploy
```

---

## Tiêu Chí Thành Công

✅ Triển khai được coi là thành công khi:

- [ ] Backend phục vụ 200 OK tại `/health`
- [ ] Swagger trả về 404 tại `/api/docs`
- [ ] Frontend tải không có lỗi 404
- [ ] Đăng nhập hoạt động với thông tin admin
- [ ] Có thể thực hiện CRUD tại /admin/portfolio
- [ ] Upload media hoạt động
- [ ] Đăng xuất chuyển hướng về /login
- [ ] Tất cả E2E tests pass trên môi trường staging
- [ ] Baseline hiệu suất đáp ứng ngưỡng chấp nhận được
- [ ] Không có lỗi hay cảnh báo console trong luồng người dùng

---

**Ngày tạo**: 02/04/2026  
**Trạng thái**: Sẵn sàng triển khai staging  
**Bước Tiếp Theo**: Thực thi checklist triển khai, sau đó xác minh thủ công trên môi trường staging