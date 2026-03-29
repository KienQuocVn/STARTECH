# Setup

## 1. Yêu cầu môi trường

- Node.js 20+
- npm 10+
- MySQL 8+

## 2. Chạy frontend local

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy:

- `http://localhost:3000`

## 3. Chạy backend local

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
npx prettier --write prisma/seed.ts
```

Backend mặc định chạy:

- `http://localhost:3001`
- Swagger:
  `http://localhost:3001/api`

## 4. Biến môi trường backend

Tối thiểu:

```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=3001
```

Khuyến nghị:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=
FROM_NAME=
FROM_EMAIL=

GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=
```

## 5. Biến môi trường frontend

Tối thiểu:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001
API_BASE_URL=http://127.0.0.1:3001
```

Ghi chú:

- `NEXT_PUBLIC_API_BASE_URL`
  dùng cho client-side fetch.
- `API_BASE_URL`
  dùng cho server-side fetch trong Next.js.

## 6. Quy trình chạy local đầy đủ

1. Khởi động MySQL.
2. Chạy backend.
3. Chạy frontend.
4. Kiểm tra:
   - frontend render đúng
   - backend API trả dữ liệu
   - Swagger hoạt động
   - contact form ghi nhận dữ liệu

## 7. Build production

### Frontend

```bash
cd frontend
npm install
npm run build
```

### Backend

```bash
cd backend
npm install
npm run build
```

## 8. Gợi ý deploy production

### Frontend

Có thể deploy lên:

- Vercel
- VPS Node.js
- Docker + reverse proxy

### Backend

Có thể deploy lên:

- VPS
- Railway
- Render
- Fly.io
- Docker container

### Database

Phù hợp:

- Aiven MySQL
- PlanetScale
- VPS MySQL riêng

## 9. File 3D Spline deploy ở đâu?

Hiện tại project có các file:

- `frontend/public/3D/startech.spline`
- `frontend/public/3D/startech_reponsive.spline`
- `frontend/public/3D/laptop.spline`
- `frontend/public/3D/laptop_responsive.spline`

Khi deploy frontend, các file này sẽ được phục vụ như static asset.

Ví dụ:

- `frontend/public/3D/laptop.spline`
  sẽ có URL:
  `https://your-domain.com/3D/laptop.spline`

### Khuyến nghị tối ưu tốc độ tải

Giai đoạn hiện tại:

- vẫn để file trong `frontend/public/3D`
- deploy cùng frontend để đơn giản hóa

Giai đoạn production tối ưu hơn:

- chuyển file `.spline` sang CDN/object storage
- ví dụ:
  - Cloudflare R2
  - AWS S3 + CloudFront
  - BunnyCDN

Lợi ích:

- tải nhanh hơn do edge cache
- giảm tải cho server frontend
- dễ version asset 3D

### Best practice cho Spline

- Tạo riêng scene cho mobile và desktop như hiện tại là đúng hướng.
- Giảm texture và chi tiết thừa trong file 3D.
- Lazy load component 3D khi vào viewport.
- Không để nhiều scene 3D tải cùng lúc trên một trang.
- Bật cache-control dài hạn cho asset `.spline`.

## 10. Ghi chú vận hành

- Backend hiện hardcode CORS local trong `backend/src/main.ts`, cần cập nhật trước khi deploy production.
- Nên bổ sung `.env.example` cho cả frontend và backend.
- Nên có CI/CD build check trước khi release.
