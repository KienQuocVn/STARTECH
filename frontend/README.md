# STARTECH - Website Giải Pháp Công Nghệ

STARTECH là website giới thiệu dịch vụ công nghệ chuyên nghiệp, cung cấp các giải pháp thiết kế website, phát triển ứng dụng di động và phần mềm quản lý doanh nghiệp.

## 🚀 Công Nghệ Sử Dụng

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Inter (sans-serif), JetBrains Mono (monospace)

## 📋 Yêu Cầu Hệ Thống

- Node.js 18.x trở lên
- npm hoặc yarn hoặc pnpm

## 🔧 Cài Đặt Dự Án

### 1. Clone hoặc tải dự án về

Nếu bạn đã tải file ZIP từ v0, giải nén và mở thư mục dự án.

### 2. Cài đặt dependencies

Mở terminal trong thư mục dự án và chạy lệnh:

```bash
npm install
```

Hoặc nếu bạn sử dụng yarn:

```bash
yarn install
```

### 3. Chạy dự án ở môi trường development

```bash
npm run dev
```

Hoặc:

```bash
yarn dev
```

### 4. Mở trình duyệt

Truy cập [http://localhost:3000](http://localhost:3000) để xem website.

## 📁 Cấu Trúc Dự Án

```
STARTECH-website/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Trang chủ
│   ├── layout.tsx                # Layout chính
│   ├── globals.css               # CSS toàn cục với Tailwind
│   ├── gioi-thieu/              # Trang giới thiệu
│   │   └── components/
│   │   │   └── blog.tsx
│   │   │   └── ecosystem.tsx
│   │   │   └── ...
│   │   └── page.tsx
│   ├── dich-vu/                 # Trang dịch vụ
│   │   └── page.tsx
│   ├── thiet-ke-website/        # Trang thiết kế website
│   │   └── page.tsx
│   ├── du-an/                   # Trang dự án
│   │   └── page.tsx
│   ├── blog/                    # Trang blog
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── lien-he/                 # Trang liên hệ
│       └── page.tsx
├── components/                   # React Components
│   ├── header.tsx               # Header navigation
│   ├── footer.tsx               # Footer
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── public/                      # Static assets
│   ├── images/                  # Hình ảnh
│   └── ...
├── lib/                         # Utility functions
│   └── utils.ts
└── README.md                    # File này
```

## 📄 Các Trang Chính

1. **Trang chủ** (`/`) - Giới thiệu tổng quan về STARTECH
2. **Giới thiệu** (`/gioi-thieu`) - Thông tin về công ty
3. **Dịch vụ** (`/dich-vu`) - Các dịch vụ cung cấp
4. **Thiết kế Website** (`/thiet-ke-website`) - Chi tiết dịch vụ thiết kế web
5. **Dự án** (`/du-an`) - Portfolio các dự án đã thực hiện
6. **Blog** (`/blog`) - Bài viết và tin tức
7. **Liên hệ** (`/lien-he`) - Form liên hệ và thông tin công ty

## 🛠️ Scripts Có Sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra code với ESLint

## 🚀 Deploy Lên Production

### Deploy lên Vercel (Khuyến nghị)

1. Push code lên GitHub repository
2. Truy cập [vercel.com](https://vercel.com)
3. Import repository từ GitHub
4. Vercel sẽ tự động detect Next.js và deploy

Hoặc sử dụng Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Build Local

```bash
npm run build
npm run start
```

## 📝 Tùy Chỉnh Nội Dung

### Thay đổi thông tin liên hệ

Chỉnh sửa file `components/footer.tsx` để cập nhật:

- Số điện thoại
- Email
- Địa chỉ
- Links mạng xã hội

### Thêm/sửa dịch vụ

Chỉnh sửa các file trong thư mục `app/dich-vu/` và `app/thiet-ke-website/`

### Cập nhật portfolio

Chỉnh sửa file `app/du-an/page.tsx` để thêm/sửa các dự án

### Thêm bài viết blog

Chỉnh sửa file `app/blog/page.tsx` hoặc tích hợp với CMS

## 🎯 Tính Năng Chính

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ SEO-friendly với Next.js metadata
- ✅ Performance tối ưu với Next.js 15
- ✅ UI/UX hiện đại với Tailwind CSS
- ✅ Components tái sử dụng với shadcn/ui
- ✅ Typography chuyên nghiệp
- ✅ Animations và transitions mượt mà
- ✅ Form liên hệ với validation
- ✅ Portfolio showcase
- ✅ Blog layout

## 📞 Thông Tin Liên Hệ

**STARTECH - Giải Pháp Công Nghệ**

- 📱 Hotline: 091925302
- 📧 Email: contact@STARTECH.vn
- 📧 Sales: sales@STARTECH.vn
- 📧 Support: support@STARTECH.vn
- 🏢 Địa chỉ: Thành phố Hồ Chí Minh

## 📚 Tài Liệu Tham Khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🐛 Báo Lỗi

Nếu bạn gặp vấn đề khi cài đặt hoặc chạy dự án, vui lòng kiểm tra:

1. Phiên bản Node.js (cần >= 18.x)
2. Đã chạy `npm install` đầy đủ
3. Port 3000 không bị chiếm bởi ứng dụng khác
4. Xóa folder `.next` và chạy lại `npm run dev`

## 📄 License

Copyright © 2025 STARTECH. All rights reserved.

---

**Phát triển bởi STARTECH Team** 🚀
