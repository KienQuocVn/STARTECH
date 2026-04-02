import { PrismaClient, Prisma, PriceType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SEED_MODE = (process.env.SEED_MODE ?? 'safe').trim().toLowerCase();

function toSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function upsertAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'REQUIRED: Admin credentials missing for seed.\n' +
        'Please set environment variables:\n' +
        '  ADMIN_EMAIL=your-admin-email@example.com\n' +
        '  ADMIN_PASSWORD=your-strong-password\n',
    );
  }

  if (adminPassword.length < 8) {
    throw new Error('Security: Admin password must be at least 8 characters long');
  }

  const normalizedEmail = adminEmail.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      fullName: 'STARTECH Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email: normalizedEmail,
      fullName: 'STARTECH Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  return normalizedEmail;
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'DESTRUCTIVE: Seed script is blocked in production environment.This script DELETES all existing data and cannot be undone. For production database initialization, use a separate migration script instead.',
    );
  }

  if (SEED_MODE !== 'reset') {
    const adminEmail = await upsertAdminUser();

    console.log('SAFE seed completed.');
    console.log(`Admin account is ready: ${adminEmail}`);
    console.log('To load the full demo dataset, run with SEED_MODE=reset and ALLOW_DESTRUCTIVE_SEED=true.');
    return;
  }

  if (process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
    throw new Error(
      'SAFETY: Seed script requires explicit confirmation flag.\n' +
        'This script will DELETE ALL existing data in the database.\n' +
        'Command: ALLOW_DESTRUCTIVE_SEED=true npm run seed\n' +
        'Use only in development environments!\n',
    );
  }

  console.warn('');
  console.warn('╔════════════════════════════════════════════════════════════╗');
  console.warn('║ ⚠️  DESTRUCTIVE SEED SCRIPT - DELETING ALL DATA              ║');
  console.warn('╚════════════════════════════════════════════════════════════╝');
  console.warn('');
  console.warn('⏱️  This script will delete all existing data in 3 seconds...');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.warn('🔄 Proceeding with seed...\n');

  prisma.$use(async (params, next) => {
    if (params.model === 'product' && params.action === 'create') {
      const name = params.args?.data?.name;
      if (typeof name === 'string' && !params.args.data.slug) {
        params.args.data.slug = toSlug(name);
      }
    }
    return next(params);
  });

  // Xóa dữ liệu cũ (tôn trọng thứ tự khóa ngoại)
  await prisma.faqItem.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.sitePage.deleteMany();
  await (prisma as any).refreshToken.deleteMany();
  await (prisma as any).mediaAsset.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pricingFeature.deleteMany();
  await prisma.productService.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.product.deleteMany();
  await prisma.showcaseItem.deleteMany();
  await prisma.service.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.category.deleteMany();

  // 1) Seed Category
  console.log('📂 Tạo danh mục sản phẩm...');
  const category = await Promise.all([
    prisma.category.create({ data: { name: 'Ẩm thực' } }),
    prisma.category.create({ data: { name: 'Bán hàng' } }),
    prisma.category.create({ data: { name: 'Bất động sản' } }),
    prisma.category.create({ data: { name: 'Công nghệ' } }),
    prisma.category.create({ data: { name: 'Dịch vụ' } }),
    prisma.category.create({ data: { name: 'Doanh nghiệp' } }),
    prisma.category.create({ data: { name: 'Du lịch' } }),
    prisma.category.create({ data: { name: 'Giáo dục' } }),
    prisma.category.create({ data: { name: 'Giới thiệu' } }),
    prisma.category.create({ data: { name: 'Làm đẹp' } }),
    prisma.category.create({ data: { name: 'Môi trường' } }),
    prisma.category.create({ data: { name: 'Nội thất' } }),
    prisma.category.create({ data: { name: 'Ô tô' } }),
    prisma.category.create({ data: { name: 'Pháp luật' } }),
    prisma.category.create({ data: { name: 'Tài chính' } }),
    prisma.category.create({ data: { name: 'Thời trang' } }),
    prisma.category.create({ data: { name: 'Tin tức' } }),
    prisma.category.create({ data: { name: 'Xây dựng' } }),
    prisma.category.create({ data: { name: 'Y tế' } }),
  ]);

  // 2) Seed Services
  console.log('🛠️ Tạo dịch vụ...');
  const serviceRecords = await Promise.all([
    prisma.service.create({ data: { name: 'THIẾT KẾ WEBSITE' } }),
    prisma.service.create({ data: { name: 'THIẾT KẾ SÀN THƯƠNG MẠI ĐIỆN TỬ' } }),
    prisma.service.create({ data: { name: 'THIẾT KẾ WEB APP' } }),
    prisma.service.create({ data: { name: 'DỊCH VỤ SEO' } }),
    prisma.service.create({ data: { name: 'QUẢN TRỊ WEBSITE' } }),
    prisma.service.create({ data: { name: 'HOSTING' } }),
    prisma.service.create({ data: { name: 'DOMAIN' } }),
    prisma.service.create({ data: { name: 'DỊCH VỤ QUẢNG CÁO ĐA KÊNH' } }),
  ]);

  // 3) Seed Products (CONTACT => price null)
  console.log('🛍️ Tạo sản phẩm...');
  // Ensure proper typing to avoid never[] inference
  const products: Array<{ id: number }> = [];

  const product1 = await prisma.product.create({
    data: {
      name: 'WEBSITE MỸ PHẨM HÀN QUỐC',
      image_url: '/product/project5.webp',
      description: 'Website bán mỹ phẩm cao cấp với giỏ hàng, thanh toán trực tuyến và quản lý sản phẩm chuyên nghiệp.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.8,
      like: 156,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://sonatural.vn/',
    },
  });
  products.push(product1);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product1.id, category_id: category[1].id }, // Bán hàng
      { product_id: product1.id, category_id: category[9].id }, // Làm đẹp
      { product_id: product1.id, category_id: category[15].id }, // Thời trang
    ],
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'WEBSITE TRANG SỨC',
      image_url: '/product/project13.webp',
      description: 'Website bán trang sức sang trọng với giao diện tinh tế và chức năng mua hàng hiện đại.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.9,
      like: 289,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store1.k-tech-services.com/eco_kimcuong/',
    },
  });
  products.push(product2);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product2.id, category_id: category[1].id }, // Bán hàng
      { product_id: product2.id, category_id: category[15].id }, // Thời trang
    ],
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'WEBSITE BÁN MÁY PHA CÀ PHÊ',
      image_url: '/product/project1.webp',
      description: 'Website bán máy pha cà phê chuyên nghiệp với tính năng đặt hàng và thanh toán trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 234,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://zentrix.vn/',
    },
  });
  products.push(product3);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product3.id, category_id: category[1].id }, // Bán hàng
      { product_id: product3.id, category_id: category[0].id }, // Ẩm thực
      { product_id: product3.id, category_id: category[3].id }, // Công nghệ
    ],
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'WEBSITE BÁN Ô TÔ',
      image_url: '/product/project6.webp',
      description: 'Website bán ô tô hiện đại với tính năng tìm kiếm, so sánh và liên hệ mua xe dễ dàng.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 178,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store3.k-tech-services.com/banxeBYD/',
    },
  });
  products.push(product4);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product4.id, category_id: category[1].id }, // Bán hàng
      { product_id: product4.id, category_id: category[12].id }, // Ô tô
    ],
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'WEBSITE CHO THUÊ – MUA BÁN SIM SỐ ĐẸP',
      image_url: '/product/project4.webp',
      description: 'Website mua bán và cho thuê sim số đẹp, tích hợp tìm kiếm thông minh và thanh toán online.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 47,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/simsodep/',
    },
  });
  products.push(product5);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product5.id, category_id: category[1].id }, // Bán hàng
      { product_id: product5.id, category_id: category[3].id }, // Công nghệ
      { product_id: product5.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product6 = await prisma.product.create({
    data: {
      name: 'WEBSITE THỰC PHẨM XANH',
      image_url: '/product/project9.webp',
      description: 'Website bán thực phẩm sạch, thân thiện môi trường với giỏ hàng và thanh toán trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.4,
      like: 41,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://vietnexus.vn/',
    },
  });
  products.push(product6);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product6.id, category_id: category[1].id }, // Bán hàng
      { product_id: product6.id, category_id: category[0].id }, // Ẩm thực
      { product_id: product6.id, category_id: category[10].id }, // Môi trường
    ],
  });

  const product7 = await prisma.product.create({
    data: {
      name: 'WEBSITE THIẾT BỊ THANG MÁY',
      image_url: '/product/project7.webp',
      description: 'Website giới thiệu và bán thiết bị thang máy, tối ưu cho doanh nghiệp xây dựng và cơ khí.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 40,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/thangmay/',
    },
  });
  products.push(product7);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product7.id, category_id: category[1].id }, // Bán hàng
      { product_id: product7.id, category_id: category[17].id }, // Xây dựng
      { product_id: product7.id, category_id: category[3].id }, // Công nghệ
    ],
  });

  const product8 = await prisma.product.create({
    data: {
      name: 'WEBSITE MUA BÁN – ĐẤU GIÁ BIỂN SỐ XE',
      image_url: '/product/project3.webp',
      description: 'Website mua bán và đấu giá biển số xe với hệ thống đăng ký, quản lý và thanh toán online.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 87,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/sodo/',
    },
  });
  products.push(product8);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product8.id, category_id: category[1].id }, // Bán hàng
      { product_id: product8.id, category_id: category[12].id }, // Ô tô
      { product_id: product8.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product9 = await prisma.product.create({
    data: {
      name: 'WEBSITE BÁN GIA DỤNG',
      image_url: '/product/project10.webp',
      description: 'Website bán đồ gia dụng tiện ích với giỏ hàng, thanh toán trực tuyến và quản lý đơn hàng dễ dàng.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 64,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://enchenvietnam.com/',
    },
  });
  products.push(product9);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product9.id, category_id: category[1].id }, // Bán hàng
      { product_id: product9.id, category_id: category[11].id }, // Nội thất
    ],
  });

  const product10 = await prisma.product.create({
    data: {
      name: 'WEBSITE BÁN HÀNG NÔNG SẢN',
      image_url: '/product/project16.webp',
      description: 'Website bán nông sản sạch, giao diện thân thiện, hỗ trợ đặt hàng và thanh toán online.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.3,
      like: 70,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://vinape.com.vn/',
    },
  });
  products.push(product10);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product10.id, category_id: category[1].id }, // Bán hàng
      { product_id: product10.id, category_id: category[0].id }, // Ẩm thực
      { product_id: product10.id, category_id: category[10].id }, // Môi trường
    ],
  });

  const product11 = await prisma.product.create({
    data: {
      name: 'WEBSITE KINH DOANH TRÀ CỔ',
      image_url: '/product/project17.webp',
      description: 'Website kinh doanh trà cổ truyền, giới thiệu sản phẩm và hỗ trợ đặt hàng trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 42,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/tracohoanguyen/',
    },
  });
  products.push(product11);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product11.id, category_id: category[1].id }, // Bán hàng
      { product_id: product11.id, category_id: category[0].id }, // Ẩm thực
    ],
  });

  const product12 = await prisma.product.create({
    data: {
      name: 'WEBSITE ÁO DÀI',
      image_url: '/product/project18.webp',
      description: 'Website bán áo dài cao cấp với giao diện tinh tế và chức năng mua hàng hiện đại.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.3,
      like: 92,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/eco_aodaingoclan/',
    },
  });
  products.push(product12);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product12.id, category_id: category[1].id }, // Bán hàng
      { product_id: product12.id, category_id: category[15].id }, // Thời trang
    ],
  });

  const product13 = await prisma.product.create({
    data: {
      name: 'WEBSITE KINH DOANH MÁY CHIẾU',
      image_url: '/product/project19.webp',
      description: 'Website kinh doanh máy chiếu chuyên nghiệp, phù hợp cho văn phòng và trường học.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.8,
      like: 51,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/maychieu/',
    },
  });
  products.push(product13);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product13.id, category_id: category[1].id }, // Bán hàng
      { product_id: product13.id, category_id: category[3].id }, // Công nghệ
      { product_id: product13.id, category_id: category[7].id }, // Giáo dục
    ],
  });

  const product14 = await prisma.product.create({
    data: {
      name: 'WEBSITE HOA TƯƠI',
      image_url: '/product/project20.webp',
      description: 'Website bán và đặt hoa tươi trực tuyến với tính năng giỏ hàng và giao hàng tận nơi.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 63,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/flower/',
    },
  });
  products.push(product14);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product14.id, category_id: category[1].id }, // Bán hàng
      { product_id: product14.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product15 = await prisma.product.create({
    data: {
      name: 'WEBSITE DECOR GIẤY DÁN TƯỜNG',
      image_url: '/product/project21.webp',
      description: 'Website kinh doanh giấy dán tường và đồ decor nội thất, hỗ trợ đặt hàng trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 62,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/globalwow/',
    },
  });
  products.push(product15);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product15.id, category_id: category[1].id }, // Bán hàng
      { product_id: product15.id, category_id: category[11].id }, // Nội thất
    ],
  });

  const product16 = await prisma.product.create({
    data: {
      name: 'WEBSITE NHÀ THUỐC',
      image_url: '/product/project22.webp',
      description: 'Website nhà thuốc trực tuyến cung cấp thuốc và sản phẩm chăm sóc sức khỏe.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 91,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/nhathuoc/',
    },
  });
  products.push(product16);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product16.id, category_id: category[1].id }, // Bán hàng
      { product_id: product16.id, category_id: category[18].id }, // Y tế
    ],
  });

  const product17 = await prisma.product.create({
    data: {
      name: 'WEBSITE BÁN PHỤ GIA THỰC PHẨM',
      image_url: '/product/project23.webp',
      description: 'Website kinh doanh phụ gia thực phẩm, giới thiệu sản phẩm và hỗ trợ đặt hàng online.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 79,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/eco_lehoasen/',
    },
  });
  products.push(product17);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product17.id, category_id: category[1].id },
      { product_id: product17.id, category_id: category[0].id },
    ],
  });
  const product18 = await prisma.product.create({
    data: {
      name: 'WEBSITE TẬP ĐOÀN BẤT ĐỘNG SẢN',
      image_url: '/product/project24.webp',
      description: 'Website giới thiệu tập đoàn bất động sản, dự án và các dịch vụ đầu tư nổi bật.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 96,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://thien-khoi.com/',
    },
  });
  products.push(product18);
  await prisma.productCategory.createMany({
    data: [{ product_id: product18.id, category_id: category[2].id }],
  });

  const product19 = await prisma.product.create({
    data: {
      name: 'WEBSITE BẤT ĐỘNG SẢN',
      image_url: '/product/project25.webp',
      description: 'Website giới thiệu, đăng tin mua bán và cho thuê bất động sản chuyên nghiệp.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 77,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store.k-tech-services.com/wp-batdongsan/',
    },
  });
  products.push(product19);
  await prisma.productCategory.createMany({
    data: [{ product_id: product19.id, category_id: category[2].id }],
  });
  const product20 = await prisma.product.create({
    data: {
      name: 'WEBSITE VINHOME CENTER PARK',
      image_url: '/product/project26.webp',
      description: 'Website giới thiệu dự án Vinhomes Central Park với thông tin, hình ảnh và tiện ích chi tiết.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 57,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store.k-tech-services.com/webVinhomes/',
    },
  });
  products.push(product20);
  await prisma.productCategory.createMany({
    data: [{ product_id: product20.id, category_id: category[2].id }],
  });

  const product21 = await prisma.product.create({
    data: {
      name: 'WEBSITE DỰ ÁN BẤT ĐỘNG SẢN',
      image_url: '/product/project27.webp',
      description: 'Website giới thiệu các dự án bất động sản với bản đồ, thông tin chi tiết và liên hệ tư vấn.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 52,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://k-tech.net.vn/san-pham/website-du-an-bat-dong-san/',
    },
  });
  products.push(product21);
  await prisma.productCategory.createMany({
    data: [{ product_id: product21.id, category_id: category[2].id }],
  });
  const product22 = await prisma.product.create({
    data: {
      name: 'WEBSITE DỰ ÁN MINH QUỐC PLAZA',
      image_url: '/product/project28.webp',
      description: 'Website giới thiệu dự án Minh Quốc Plaza với thông tin vị trí, tiện ích và tiến độ thi công.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 98,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://minhquocplaza.net/',
    },
  });
  products.push(product22);
  await prisma.productCategory.createMany({
    data: [{ product_id: product22.id, category_id: category[2].id }],
  });
  const product23 = await prisma.product.create({
    data: {
      name: 'WEBSITE KHU ĐÔ THỊ THE GLOBAL CITY',
      image_url: '/product/project29.webp',
      description: 'Website giới thiệu dự án khu đô thị The Global City với hình ảnh, tiện ích và liên hệ tư vấn.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 69,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://theglobalcitymasterisehomes.com/',
    },
  });
  products.push(product23);
  await prisma.productCategory.createMany({
    data: [{ product_id: product23.id, category_id: category[2].id }],
  });

  const product24 = await prisma.product.create({
    data: {
      name: 'WEBSITE GIÁO DỤC BLOCKCHAIN',
      image_url: '/product/project30.webp',
      description: 'Website đào tạo về công nghệ Blockchain, cung cấp khóa học và tài liệu học trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 61,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store3.k-tech-services.com/learningchain/',
    },
  });
  products.push(product24);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product24.id, category_id: category[7].id },
      { product_id: product24.id, category_id: category[3].id },
    ],
  });
  const product25 = await prisma.product.create({
    data: {
      name: 'WEBSITE CUNG CẤP DỊCH VỤ PROXY',
      image_url: '/product/project31.webp',
      description: 'Website cung cấp dịch vụ Proxy và SOCKS, hỗ trợ thanh toán tự động và quản lý tài khoản.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.8,
      like: 96,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store3.k-tech-services.com/sellsocks247/',
    },
  });
  products.push(product25);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product25.id, category_id: category[3].id },
      { product_id: product25.id, category_id: category[4].id },
    ],
  });

  const product26 = await prisma.product.create({
    data: {
      name: 'WEBSITE ĐỊNH VỊ XE',
      image_url: '/product/project32.webp',
      description: 'Website dịch vụ định vị xe, quản lý hành trình và theo dõi thời gian thực.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 44,
      completion_time: '7 - 10 ngày',
      demo_url: 'http://store3.k-tech-services.com/dinhvixe247/',
    },
  });
  products.push(product26);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product26.id, category_id: category[3].id },
      { product_id: product26.id, category_id: category[12].id },
    ],
  });

  const product27 = await prisma.product.create({
    data: {
      name: 'WEBSITE CÔNG TY CÔNG NGHỆ',
      image_url: '/product/project33.webp',
      description: 'Website công ty công nghệ chuyên nghiệp, giới thiệu sản phẩm và dịch vụ.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.7,
      like: 84,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://thmp.com.vn/',
    },
  });
  products.push(product27);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product27.id, category_id: category[3].id }, // Công nghệ
      { product_id: product27.id, category_id: category[5].id }, // Doanh nghiệp
    ],
  });

  const product28 = await prisma.product.create({
    data: {
      name: 'WEBSITE KIẾN TRÚC',
      image_url: '/product/project15.webp',
      description: 'Website kiến trúc chuyên nghiệp, giới thiệu sản phẩm và dịch vụ.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.9,
      like: 84,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://apollodesignvn.com/',
    },
  });
  products.push(product28);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product28.id, category_id: category[11].id }, // Nội thất
      { product_id: product28.id, category_id: category[17].id }, // Kiến trúc
    ],
  });

  const product29 = await prisma.product.create({
    data: {
      name: 'WEBSITE NHÀ SẢN XUẤT NGHỆ THUẬT',
      image_url: '/product/project34.webp',
      description: 'Website giới thiệu nhà sản xuất nghệ thuật, trưng bày catalogue và bán hàng B2B/B2C.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.8,
      like: 93,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://theyouniverse.com.au/',
    },
  });
  products.push(product29);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product29.id, category_id: category[5].id }, // Doanh nghiệp
      { product_id: product29.id, category_id: category[8].id }, // Giới thiệu
    ],
  });

  const product30 = await prisma.product.create({
    data: {
      name: 'WEBSITE CÔNG TY LUẬT',
      image_url: '/product/project35.webp',
      description: 'Website công ty luật chuyên nghiệp, giới thiệu dịch vụ pháp lý và hỗ trợ tư vấn trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.8,
      like: 99,
      completion_time: '7 - 10 ngày',
      demo_url: 'http://store1.k-tech-services.com/phapluat/',
    },
  });
  products.push(product30);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product30.id, category_id: category[5].id }, // Doanh nghiệp
      { product_id: product30.id, category_id: category[13].id }, // Pháp luật
    ],
  });

  const product31 = await prisma.product.create({
    data: {
      name: 'WEBSITE CÔNG TY QUẢNG CÁO',
      image_url: '/product/project14.webp',
      description: 'Website công ty quảng cáo, trưng bày dịch vụ sáng tạo và mẫu chiến dịch.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 59,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/abcsmqc/',
    },
  });
  products.push(product31);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product31.id, category_id: category[5].id }, // Doanh nghiệp
      { product_id: product31.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product32 = await prisma.product.create({
    data: {
      name: 'WEBSITE DỊCH VỤ DƯỠNG LÃO',
      image_url: '/product/project36.webp',
      description: 'Website dịch vụ dưỡng lão, giới thiệu gói chăm sóc và quản lý đặt lịch cho người cao tuổi.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 75,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://duonglaoanphuc.com/',
    },
  });
  products.push(product32);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product32.id, category_id: category[4].id }, // Dịch vụ
      { product_id: product32.id, category_id: category[18].id }, // Y tế
    ],
  });

  const product33 = await prisma.product.create({
    data: {
      name: 'WEBSITE DỊCH VỤ CHO THUÊ XE',
      image_url: '/product/project37.webp',
      description: 'Website dịch vụ cho thuê xe với hệ thống đặt xe, quản lý đơn và thanh toán trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 75,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://wemove.vn/',
    },
  });
  products.push(product33);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product33.id, category_id: category[4].id }, // Dịch vụ
      { product_id: product33.id, category_id: category[12].id }, // Ô tô
    ],
  });

  const product34 = await prisma.product.create({
    data: {
      name: 'WEBSITE DỊCH VỤ PHÁP LÝ',
      image_url: '/product/project38.webp',
      description: 'Website dịch vụ pháp lý, cung cấp tư vấn trực tuyến và thông tin pháp luật chuyên sâu.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 75,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://askyonder.com/',
    },
  });
  products.push(product34);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product34.id, category_id: category[4].id }, // Dịch vụ
      { product_id: product34.id, category_id: category[13].id }, // Pháp luật
    ],
  });

  const product35 = await prisma.product.create({
    data: {
      name: 'WEBSITE SALON TÓC',
      image_url: '/product/project39.webp',
      description: 'Website salon tóc, đặt lịch online và giới thiệu dịch vụ/khuyến mãi.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 47,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://ichillvn.com/',
    },
  });
  products.push(product35);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product35.id, category_id: category[4].id }, // Dịch vụ
      { product_id: product35.id, category_id: category[9].id }, // Làm đẹp
    ],
  });

  const product36 = await prisma.product.create({
    data: {
      name: 'WEBSITE BOOKING HOMESTAY',
      image_url: '/product/project40.webp',
      description: 'Website đặt phòng homestay, quản lý booking và thanh toán trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.3,
      like: 44,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/chillhouse/',
    },
  });
  products.push(product36);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product36.id, category_id: category[4].id }, // Dịch vụ
      { product_id: product36.id, category_id: category[6].id }, // Du lịch
    ],
  });

  const product37 = await prisma.product.create({
    data: {
      name: 'WEBSITE TRUYỀN THÔNG',
      image_url: '/product/project41.webp',
      description: 'Website công ty truyền thông, giới thiệu dịch vụ truyền thông và portfolio dự án.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 48,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://kollabv-j.com/#service',
    },
  });
  products.push(product37);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product37.id, category_id: category[5].id }, // Doanh nghiệp
      { product_id: product37.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product38 = await prisma.product.create({
    data: {
      name: 'WEBSITE CÔNG TY THIẾT BỊ TỰ ĐỘNG HÓA',
      image_url: '/product/project42.webp',
      description: 'Website công ty thiết bị tự động hóa, giới thiệu sản phẩm công nghiệp và giải pháp kỹ thuật.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.9,
      like: 55,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://monacotech.com.vn/',
    },
  });
  products.push(product38);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product38.id, category_id: category[5].id }, // Doanh nghiệp
      { product_id: product38.id, category_id: category[3].id }, // Công nghệ
    ],
  });

  const product39 = await prisma.product.create({
    data: {
      name: 'WEBSITE DOANH NGHIỆP IN ẤN BAO BÌ',
      image_url: '/product/project43.webp',
      description: 'Website doanh nghiệp in ấn bao bì, giới thiệu năng lực sản xuất và dịch vụ đặt hàng B2B.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.2,
      like: 51,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://xuonginhunglinh.com/',
    },
  });
  products.push(product39);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product39.id, category_id: category[5].id }, // Doanh nghiệp
      { product_id: product39.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product40 = await prisma.product.create({
    data: {
      name: 'WEBSITE DU THUYỀN VỊNH HẠ LONG',
      image_url: '/product/project44.webp',
      description: 'Website giới thiệu và đặt chỗ du thuyền Vịnh Hạ Long, hiển thị lộ trình và đặt vé trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.3,
      like: 92,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://athenapremiumcruise.com/',
    },
  });
  products.push(product40);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product40.id, category_id: category[6].id }, // Du lịch
    ],
  });

  const product41 = await prisma.product.create({
    data: {
      name: 'WEBSITE LAN HOMESTAY',
      image_url: '/product/project45.webp',
      description: 'Website homestay, quản lý phòng, đặt chỗ và thanh toán trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.3,
      like: 56,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://lanhomestay.com/',
    },
  });
  products.push(product41);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product41.id, category_id: category[6].id }, // Du lịch
      { product_id: product41.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product42 = await prisma.product.create({
    data: {
      name: 'WEBSITE ĐẶT PHÒNG KHÁCH SẠN',
      image_url: '/product/project46.webp',
      description: 'Website đặt phòng khách sạn với quản lý booking và thanh toán online.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.3,
      like: 56,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://fridaykisshotel.com/',
    },
  });
  products.push(product42);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product42.id, category_id: category[6].id }, // Du lịch
      { product_id: product42.id, category_id: category[4].id }, // Dịch vụ
    ],
  });

  const product43 = await prisma.product.create({
    data: {
      name: 'WEBSITE TOUR DU LỊCH',
      image_url: '/product/project47.webp',
      description: 'Website tour du lịch, giới thiệu tour, lịch trình và đặt chỗ trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 42,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://wanderwise12345.com/',
    },
  });
  products.push(product43);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product43.id, category_id: category[6].id }, // Du lịch
    ],
  });

  const product44 = await prisma.product.create({
    data: {
      name: 'WEBSITE TOUR DU LỊCH #2',
      image_url: '/product/project48.webp',
      description: 'Website tour du lịch chuyên nghiệp với đặt tour và quản lý khách hàng.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.6,
      like: 42,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://muinebackpackerstours-travel.com/',
    },
  });
  products.push(product44);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product44.id, category_id: category[6].id }, // Du lịch
    ],
  });

  const product45 = await prisma.product.create({
    data: {
      name: 'WEBSITE OLYMPIC UEF',
      image_url: '/product/project49.webp',
      description: 'Website sự kiện học thuật / thể thao của trường đại học, quản lý thông tin và đăng ký.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.4,
      like: 51,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://olympic.uef.edu.vn/',
    },
  });
  products.push(product45);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product45.id, category_id: category[7].id }, // Giáo dục
    ],
  });

  const product46 = await prisma.product.create({
    data: {
      name: 'WEBSITE DU HỌC NHẬT BẢN',
      image_url: '/product/project50.webp',
      description: 'Website tư vấn du học Nhật Bản, giới thiệu chương trình và hỗ trợ đăng ký.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.5,
      like: 84,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://neu-toyo.edu.vn/',
    },
  });
  products.push(product46);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product46.id, category_id: category[7].id }, // Giáo dục
      { product_id: product46.id, category_id: category[6].id }, // Du lịch (tùy chọn)
    ],
  });

  const product47 = await prisma.product.create({
    data: {
      name: 'WEBSITE KHÓA HỌC TAROT',
      image_url: '/product/project2.webp',
      description: 'Website khóa học trực tuyến về Tarot, quản lý khóa học và thanh toán học phí.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.9,
      like: 101,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store2.k-tech-services.com/khoahoc/',
    },
  });
  products.push(product47);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product47.id, category_id: category[7].id }, // Giáo dục
    ],
  });

  const product48 = await prisma.product.create({
    data: {
      name: 'WEBSITE THỜI TRANG',
      image_url: '/product/project8.webp',
      description: 'Website thời trang, giới thiệu bộ sưu tập và hỗ trợ mua hàng trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.8,
      like: 28,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store.k-tech-services.com/wp-thoitrang/',
    },
  });
  products.push(product48);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product48.id, category_id: category[15].id }, // Thời trang
    ],
  });

  const product49 = await prisma.product.create({
    data: {
      name: 'WEBSITE ICON DENIM',
      image_url: '/product/project11.webp',
      description: 'Website bán denim/áo khoác với trang sản phẩm, giỏ hàng và thanh toán trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.9,
      like: 77,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://store.k-tech-services.com/wp-banhang/',
    },
  });
  products.push(product49);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product49.id, category_id: category[15].id }, // Thời trang
    ],
  });

  const product50 = await prisma.product.create({
    data: {
      name: 'WEBSITE ĐĂNG KÝ KHÓA HỌC',
      image_url: '/product/project12.webp',
      description: 'Website đăng ký khóa học, quản lý học viên và thanh toán học phí trực tuyến.',
      price: null,
      price_Type: PriceType.CONTACT,
      rating: 4.9,
      like: 77,
      completion_time: '7 - 10 ngày',
      demo_url: 'https://anhthetime.com/',
    },
  });
  products.push(product50);
  await prisma.productCategory.createMany({
    data: [
      { product_id: product50.id, category_id: category[7].id }, // Giáo dục
    ],
  });

  // 4) Seed Product Services (ngẫu nhiên 3-5 dịch vụ mỗi sản phẩm)
  console.log('🔗 Tạo liên kết sản phẩm - dịch vụ...');
  for (const product of products) {
    const shuffled = [...serviceRecords].sort(() => 0.5 - Math.random());
    const take = Math.floor(Math.random() * 3) + 3; // 3-5
    const chosen = shuffled.slice(0, take);
    for (const svc of chosen) {
      await prisma.productService.create({
        data: {
          product_id: product.id,
          service_id: svc.id,
        },
      });
    }
  }

  // 5) Seed Images
  console.log('🖼️ Tạo hình ảnh sản phẩm...');
  for (const product of products) {
    const imageCount = Math.floor(Math.random() * 3) + 2; // 2-4 images
    for (let i = 1; i <= imageCount; i++) {
      await prisma.productImage.create({
        data: {
          product_id: product.id,
          url: `/product/gallery/${product.id}-${i}.webp`,
        },
      });
    }
  }

  // 6) Seed Feedback (không gắn với product theo schema hiện tại)
  console.log('💬 Tạo phản hồi khách hàng...');
  const feedbackData = [
    {
      name: 'Nguyễn Văn An',
      comment:
        'Dịch vụ thiết kế website rất chuyên nghiệp, team hỗ trợ nhiệt tình. Website của công ty tôi được làm đúng deadline và chất lượng vượt mong đợi.',
      rating: 5.0,
    },
    {
      name: 'Trần Thị Bích',
      comment: 'Ứng dụng mobile được phát triển rất tốt, giao diện đẹp và dễ sử dụng. Khách hàng của shop tôi rất hài lòng với app.',
      rating: 5.0,
    },
    {
      name: 'Lê Minh Công',
      comment: 'Hệ thống ERP giúp công ty tôi quản lý hiệu quả hơn rất nhiều. Tính năng báo cáo và phân tích rất chi tiết và hữu ích.',
      rating: 4.0,
    },
    {
      name: 'Phạm Thu Hằng',
      comment: 'Website thương mại điện tử được thiết kế đẹp mắt, tốc độ load nhanh. Tính năng thanh toán và quản lý đơn hàng rất tiện lợi.',
      rating: 5.0,
    },
    {
      name: 'Hoàng Đức Minh',
      comment: 'Landing page được tối ưu SEO rất tốt, tỷ lệ chuyển đổi tăng đáng kể. Thiết kế responsive hoàn hảo trên mọi thiết bị.',
      rating: 4.0,
    },
    {
      name: 'Vũ Thị Mai',
      comment: 'Dịch vụ bảo trì website rất tốt, team support 24/7. Mọi vấn đề đều được giải quyết nhanh chóng và hiệu quả.',
      rating: 5.0,
    },
    {
      name: 'Đỗ Xuân Thành',
      comment: 'Website du lịch làm rất đẹp, booking system hoạt động mượt mà. Khách hàng dễ dàng đặt tour và thanh toán.',
      rating: 5.0,
    },
    {
      name: 'Bùi Thị Lan',
      comment: 'Platform học online rất tiện lợi, video mượt, quiz tương tác tốt. Học viên của tôi rất thích học trên này.',
      rating: 5.0,
    },
  ];

  for (const fb of feedbackData) {
    await prisma.feedback.create({ data: fb });
  }

  // 7) Seed Features
  console.log('⭐ Tạo tính năng...');
  await prisma.showcaseItem.createMany({
    data: [
      {
        image_url: '/img/Website Sản phẩm vòng đeo Phương Tâm.webp',
        name: 'WEBSITE THIÊN TÂM ĐẠO CHUYÊN CUNG CẤP SẢN PHẨM VÒNG ĐEO TAY',
        description:
          'Thiết kế giao diện sử dụng những gam màu theo khuynh hướng Phật giáo, kết hợp tính năng bán hàng giúp khách hàng đặt mua vòng đeo tay dễ dàng',
        display_order: 1,
      },
      {
        image_url: '/img/Website Tiền ảo Coin Catapult.webp',
        name: 'NGHIÊN CỨU & ĐẦU TƯ TIỀN ĐIỆN TỬ QUA TRANG WEB COIN CATAPULT',
        description:
          'Website đơn giản, bố cục sắp xếp rõ ràng, dễ sử dụng, các số liệu tài chính được làm nổi bật để người dùng thuận tiện theo dõi thông tin cần thiết',
        display_order: 2,
      },
      {
        image_url: '/img/Du-an-Website-Cong-nghe-VNG.webp',
        name: 'TÌM HIỂU CÔNG NGHỆ ĐIỆN TOÁN ĐÁM MÂY VỚI WEBSITE VNG CLOUD',
        description:
          'Website thiết kế hình ảnh theo dạng 3D độc đáo, tính năng đăng ký dùng thử và mua trực tuyến áp dụng giúp tăng tỷ lệ chuyển đổi khách hàng hiệu quả',
        display_order: 3,
      },
      {
        image_url: '/img/App_chup_anh.webp',
        name: 'CHỤP ẢNH & CHIA SẺ NGAY CHO BẠN BÈ THÔNG QUA ỨNG DỤNG SHAREU',
        description:
          'Không chỉ hỗ trợ chụp và chỉnh ảnh, ứng dụng còn tích hợp tính năng chia sẻ ảnh ngay khi chụp giúp hình ảnh gửi đến người thân, bạn bè trong tích tắc',
        display_order: 4,
      },
      {
        image_url: '/img/Du_an_Website_MoonLook.webp',
        name: 'TRANG WEB BÁN MỸ PHẨM CHÍNH HÃNG THƯƠNG HIỆU MOONLOOK',
        description:
          'Sắc hồng tươi mới làm cho website trở nên ấn tượng, sản phẩm trưng bày bắt mắt đi kèm công dụng rõ ràng góp phần thu hút lượng lớn người mua',
        display_order: 5,
      },
      {
        image_url: '/img/Website_nha_khoa.webp',
        name: 'DỊCH VỤ CHĂM SÓC SỨC KHỎE RĂNG MIỆNG TẠI WEBSITE ALIGN DENTAL',
        description:
          'Website tập trung trình bày hình ảnh thực tế phòng khám, đội ngũ nha sĩ và hành trình thay đổi của khách hàng để tăng uy tín thương hiệu',
        display_order: 6,
      },
      {
        image_url: '/img/Visa.webp',
        name: 'WEBSITE TƯ VẤN DIỆP GIA MỞ RỘNG CƠ HỘI ĐỊNH CƯ BỒ ĐÀO NHA',
        description: 'Website được thiết kế đẹp mắt với nội dung gọn gàng, hình ảnh mô tả đất nước Bồ Đào Nha sống động được lồng ghép tinh tế',
        display_order: 7,
      },
      {
        image_url: '/img/68-MIAN-GLOBAL.webp',
        name: 'WEBSITE MAIN GLOBAL TỔ CHỨC GIỚI THIỆU & XÚC TIẾN THƯƠNG MẠI',
        description:
          'Giao diện đẹp mắt, sản phẩm hiển thị rõ ràng, tính năng responsive giúp website tương thích đa thiết bị nâng cao trải nghiệm người dùng',
        display_order: 8,
      },
      {
        image_url: '/img/DIEN_LUC_DIEN_BIEN.webp',
        name: 'WEB EVN ĐIỆN BIÊN HỖ TRỢ NGƯỜI DÂN KỊP THỜI CÁC VẤN ĐỀ ĐIỆN LỰC',
        description: 'Website thiết kế cung cấp thông tin và tin tức điện lực, kết hợp tính năng tra cứu và thanh toán hóa đơn trực tuyến',
        display_order: 9,
      },
      {
        image_url: '/img/DB_ACOUSTIC.webp',
        name: 'SỐNG ĐỘNG VỚI NHỮNG THIẾT BỊ ÂM THANH ĐƯỢC BÁN TẠI DB ACOUSTIC',
        description: 'Trang web bán các thiết bị âm thanh trực tuyến, giao diện dễ sử dụng giúp khách hàng đặt mua thuận tiện',
        display_order: 10,
      },
      {
        image_url: '/img/HELIOCARE.webp',
        name: 'NÂNG TẦM SẮC VÓC VỚI SẢN PHẨM CHĂM SÓC DA TẠI WEB HELIOCARE',
        description: 'Màu sắc tươi mới, sản phẩm nổi bật, tính năng flash sale hấp dẫn thu hút nhiều khách hàng',
        display_order: 11,
      },
      {
        image_url: '/img/CHANGE.webp',
        name: 'WEB CHANGE LAN TOẢ THÔNG ĐIỆP BẢO VỆ ĐỘNG VẬT & MÔI TRƯỜNG',
        description:
          'Các thông điệp về môi trường và động vật được truyền tải gần gũi qua trang web sinh động, hỗ trợ kết nối con người với thiên nhiên',
        display_order: 12,
      },
      {
        image_url: '/img/OSAKAR.webp',
        name: 'MẪU XE ĐIỆN THÔNG MINH BÁN CHÍNH THỨC TẠI WEB OSAKAR',
        description: 'Website chuyên nghiệp, tích hợp tính năng bán hàng giúp tăng hiệu quả tiếp cận khách hàng',
        display_order: 13,
      },
      {
        image_url: '/img/58 - Human Dynamic Viet Nam.webp',
        name: 'PHÁT TRIỂN NHÂN LỰC HIỆU QUẢ VỚI WEBSITE TƯ VẤN HUMAN DYNAMIC',
        description:
          'Trang web thiết kế đơn giản với bố cục rõ ràng, nội dung và hình ảnh bố trí từng phần hợp lý để người dùng dễ dàng tìm hiểu thông tin trên website',
        display_order: 14,
      },
      {
        image_url: '/img/62 - VEGAPEDIA.webp',
        name: 'WEBSITE THỊT THỰC VẬT VEGAPEDIA ĐỊA CHỈ DÀNH CHO NGƯỜI ĂN CHAY',
        description:
          'Giao diện website mang màu xanh ấn tượng, kết hợp sắc nâu đặc trưng của thịt thực vật làm nổi bật sản phẩm, hình ảnh mô tả sinh động hấp dẫn người dùng',
        display_order: 15,
      },
      {
        image_url: '/img/63-Phuong-Anh-mebio.webp',
        name: 'AN TOÀN VỚI WEB PHƯƠNG ANH CUNG CẤP SINH PHẨM & VACXIN Y TẾ',
        description:
          'Thiết kế giao diện web đẹp mắt với hình ảnh sản phẩm thực thế đi kèm nội dung mô tả chi tiết, trang còn tích hợp sẵn Google Map để khách hàng dễ tìm địa chỉ',
        display_order: 16,
      },
      {
        image_url: '/img/64-Green-ACADEMY.webp',
        name: 'HỌC CÔNG NGHỆ THÔNG TIN & THIẾT KẾ TẠI WEBSITE GREEN ACADEMY',
        description:
          'Chú trọng thiết kế đơn giản, website tập trung trình bày nội dung hữu ích, các đối tác và giảng viên thể hiện ngay trên trang web cho thấy uy tín doanh nghiệp',
        display_order: 17,
      },
      {
        image_url: '/img/65-US-MCS-JSC.webp',
        name: 'TƯ VẤN & HỖ TRỢ Y TẾ MỸ CHUYÊN NGHIỆP TẠI WEBSITE US MCS JSC',
        description:
          'Website được thiết kế điều hướng chính đến dịch vụ và các bệnh viện hàng đầu để cung cấp thông tin cần thiết góp phần tăng tỷ lệ chuyển đổi khách hàng',
        display_order: 18,
      },
      {
        image_url: '/img/66-Vietart-Stone.webp',
        name: 'WEBSITE VIETSTONE CUNG CẤP ĐÁ XÂY DỰNG UY TÍN & CHẤT LƯỢNG',
        description:
          'Website trưng bày sản phẩm bắt mắt với hình ảnh thực tế giúp người dùng có cái nhìn trực quan, chức năng tùy biến ngôn ngữ phù hợp với nhiều người dùng',
        display_order: 19,
      },
      {
        image_url: '/img/Duke-tex.webp',
        name: 'ĐẶT HÀNG SỢI DỆT CHẤT LƯỢNG NGAY TRÊN WEBSITE DUKE TEX',
        description:
          'Website chuyên nghiệp chuẩn SEO, tương thích đa thiết bị và thân thiện với người dùng giúp doanh nghiệp mở rộng nhiều cơ hội kinh doanh',
        display_order: 20,
      },
      {
        image_url: '/img/Freshc.webp',
        name: 'WEB FRESHC THỨC UỐNG CHĂM SÓC SỨC KHỎE TỪ BÊN TRONG',
        description:
          'Website tươi mới được kết hợp từ những sắc màu tự nhiên, bên cạnh các nội dung chăm sóc sức khỏe hữu ích bằng biện pháp tiêu dùng xanh',
        display_order: 21,
      },
      {
        image_url: '/img/KIM-DELTA-VIET-NAM.webp',
        name: 'CÙNG TÌM HIỂU DỰ ÁN CẢI THIỆN NGHỀ CÁ THÔNG QUA WEBSITE FIT',
        description:
          'Website cung cấp nội dung về dự án bảo vệ nghề cá, hệ thống tùy chỉnh ngôn ngữ giúp trang web hiển thị ngôn ngữ phù hợp với đối tượng người dùng',
        display_order: 22,
      },
      {
        image_url: '/img/Lovefish-Aqua.webp',
        name: 'CHỐT ĐƠN SẢN PHẨM CHĂM SÓC CÁ CẢNH NGAY TRÊN WEB LOVEFISH',
        description:
          'Giao diện website sinh động, khoảng cách trang thông thoáng, các phần phân chia rõ ràng hỗ trợ người dùng dễ dàng quan sát và tìm kiếm sản phẩm',
        display_order: 23,
      },
      {
        image_url: '/img/O-TRADING.webp',
        name: 'MUA SẮM ĐỒ DÙNG GIA ĐÌNH TẠI WEBSITE HIỆN ĐẠI CỦA O TRADING',
        description:
          'Website kết hợp tông màu sáng nhã nhặn làm cho các sản phẩm gia dụng trở nên đẹp mắt qua đó góp phần đảm bảo tính thẩm mỹ cho tổng thể website',
        display_order: 24,
      },
    ],
  });

  const features = await Promise.all([
    prisma.feature.create({
      data: {
        name: 'Thiết kế responsive',
        description: 'Website hiển thị tối ưu trên mọi thiết bị: desktop, tablet, mobile',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Tối ưu SEO cơ bản',
        description: 'Tối ưu on-page SEO, meta tags, sitemap và tốc độ tải trang',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Tích hợp thanh toán',
        description: 'Tích hợp cổng thanh toán VNPay, Momo, ZaloPay và chuyển khoản ngân hàng',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Quản lý nội dung (CMS)',
        description: 'Hệ thống quản lý nội dung cho phép cập nhật thông tin dễ dàng',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Chat trực tuyến',
        description: 'Tích hợp chat box hỗ trợ khách hàng 24/7 với Zalo, Facebook Messenger',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Báo cáo thống kê',
        description: 'Dashboard báo cáo chi tiết về traffic, đơn hàng và doanh thu',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Backup tự động',
        description: 'Sao lưu dữ liệu website tự động hàng ngày',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Bảo mật SSL',
        description: 'Chứng chỉ SSL miễn phí, mã hóa dữ liệu truyền tải',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Đa ngôn ngữ',
        description: 'Hỗ trợ đa ngôn ngữ cho thị trường quốc tế',
      },
    }),
    prisma.feature.create({
      data: {
        name: 'Tích hợp mạng xã hội',
        description: 'Kết nối Facebook, Instagram, Zalo, TikTok',
      },
    }),
  ]);

  // 8) Seed Pricing Plans (FIXED => price Decimal)
  console.log('💰 Tạo gói dịch vụ...');
  const pricingPlans = await Promise.all([
    prisma.pricingPlan.create({
      data: {
        name: 'Gói Cơ bản',
        price: new Prisma.Decimal('8000000'),
        price_Type: PriceType.FIXED,
        description: 'Phù hợp cho doanh nghiệp nhỏ, startup mới bắt đầu',
      },
    }),
    prisma.pricingPlan.create({
      data: {
        name: 'Gói Tiêu chuẩn',
        price: new Prisma.Decimal('15000000'),
        price_Type: PriceType.FIXED,
        description: 'Dành cho doanh nghiệp vừa với nhu cầu tính năng đa dạng',
      },
    }),
    prisma.pricingPlan.create({
      data: {
        name: 'Gói Chuyên nghiệp',
        price: new Prisma.Decimal('25000000'),
        price_Type: PriceType.FIXED,
        description: 'Giải pháp toàn diện cho doanh nghiệp lớn',
      },
    }),
    prisma.pricingPlan.create({
      data: {
        name: 'Gói Doanh nghiệp',
        price: new Prisma.Decimal('40000000'),
        price_Type: PriceType.FIXED,
        description: 'Gói cao cấp với tính năng tùy chỉnh theo yêu cầu',
      },
    }),
    prisma.pricingPlan.create({
      data: {
        name: 'Gói VIP',
        price: new Prisma.Decimal('60000000'),
        price_Type: PriceType.FIXED,
        description: 'Gói đặc biệt cho khách hàng có nhu cầu đặc thù và phức tạp',
      },
    }),
  ]);

  // 9) Seed Pricing Features
  console.log('🔗 Tạo liên kết gói dịch vụ - tính năng...');
  // Gói Cơ bản: 4 tính năng
  for (let i = 0; i < 4; i++) {
    await prisma.pricingFeature.create({
      data: {
        pricing_plan_id: pricingPlans[0].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói Tiêu chuẩn: 6 tính năng
  for (let i = 0; i < 6; i++) {
    await prisma.pricingFeature.create({
      data: {
        pricing_plan_id: pricingPlans[1].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói Chuyên nghiệp: 8 tính năng
  for (let i = 0; i < 8; i++) {
    await prisma.pricingFeature.create({
      data: {
        pricing_plan_id: pricingPlans[2].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói Doanh nghiệp: 9 tính năng
  for (let i = 0; i < 9; i++) {
    await prisma.pricingFeature.create({
      data: {
        pricing_plan_id: pricingPlans[3].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói VIP: tất cả tính năng
  for (let i = 0; i < features.length; i++) {
    await prisma.pricingFeature.create({
      data: {
        pricing_plan_id: pricingPlans[4].id,
        feature_id: features[i].id,
      },
    });
  }

  console.log('Creating dynamic site content...');
  const homePage = await prisma.sitePage.create({
    data: {
      slug: 'home',
      title: 'Trang chủ',
      seoTitle: 'STARTECH - Thiết kế website, marketing và portfolio dự án',
      seoDescription: 'STARTECH cung cấp dịch vụ thiết kế website, marketing, portfolio dự án thực tế và giải pháp phát triển thương hiệu online.',
      heroBadge: 'Hỗ trợ tăng trưởng số',
      heroTitle: 'Thiết kế mang lại cảm xúc.',
      heroDescription: 'Trang chủ tập trung trình bày năng lực, dự án nổi bật, dịch vụ, showcase và FAQ nhằm tăng niềm tin và chuyển đổi khách hàng.',
    },
  });

  const websiteDesignPage = await prisma.sitePage.create({
    data: {
      slug: 'thiet-ke-website',
      title: 'Thiết kế website',
      seoTitle: 'Dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO tại STARTECH',
      seoDescription: 'Dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO, triển khai trọn gói và tối ưu hiệu quả kinh doanh online cho doanh nghiệp.',
      heroBadge: 'Dịch vụ thiết kế website',
      heroTitle: 'Thiết kế website chuyên nghiệp, chuẩn SEO và tối ưu chuyển đổi',
      heroDescription:
        'Landing page thiết kế website được định hướng để giới thiệu năng lực, bảng giá, quy trình và giải đáp thắc mắc một cách rõ ràng.',
    },
  });

  const servicesPage = await prisma.sitePage.create({
    data: {
      slug: 'dich-vu',
      title: 'Dịch vụ',
      seoTitle: 'Dịch vụ thiết kế website, SEO và triển khai digital tại STARTECH',
      seoDescription:
        'Khám phá các nhóm dịch vụ STARTECH đang cung cấp: thiết kế website, website bán hàng, SEO, quản trị và vận hành online cho doanh nghiệp.',
      heroBadge: 'Hệ sinh thái dịch vụ',
      heroTitle: 'Giải pháp triển khai linh hoạt cho doanh nghiệp',
      heroDescription:
        'Trang dịch vụ tập trung trình bày các hướng triển khai website, SEO và vận hành giúp doanh nghiệp xây dựng hiện diện số bền vững.',
    },
  });

  const projectsPage = await prisma.sitePage.create({
    data: {
      slug: 'du-an',
      title: 'Dự án',
      seoTitle: 'Portfolio dự án website STARTECH đã triển khai',
      seoDescription: 'Tổng hợp các mẫu website doanh nghiệp, bán hàng, portfolio và landing page STARTECH đã thiết kế cho khách hàng.',
      heroBadge: 'Portfolio triển khai',
      heroTitle: 'Dự án thực tế trên nhiều lĩnh vực',
      heroDescription: 'Trang dự án được dùng để trưng bày năng lực thiết kế, công nghệ triển khai và các dự án tiêu biểu đã đi vào vận hành.',
    },
  });

  const aboutPage = await prisma.sitePage.create({
    data: {
      slug: 'gioi-thieu',
      title: 'Giới thiệu',
      seoTitle: 'Giới thiệu STARTECH và đội ngũ triển khai website',
      seoDescription: 'Tìm hiểu về đội ngũ, giá trị khác biệt, những nhóm dịch vụ và năng lực triển khai của STARTECH.',
      heroBadge: 'Điểm đa dạng của STARTECH',
      heroTitle: 'Chúng tôi',
      heroDescription: 'Sở hữu những chiến binh giàu kinh nghiệm thực chiến',
    },
  });

  await prisma.pageSection.createMany({
    data: [
      {
        pageId: homePage.id,
        sectionKey: 'home-hero',
        title: 'Thiết kế mang lại cảm xúc.',
        subtitle: 'Những trải nghiệm để lại ấn tượng sâu sắc.',
        description: 'Chúng tôi kết hợp sự sáng tạo, cảm xúc và đổi mới để tạo ra thế giới kỹ thuật số mà khán giả của bạn có thể kết nối.',
        primaryButtonLabel: 'Liên hệ ngay',
        primaryButtonHref: '/lien-he',
        contentJson: {
          sideDescription:
            'Dù thông qua giao diện trực quan, hiệu ứng 3D sống động hay cách kể chuyện bằng hình ảnh táo bạo, chúng tôi thiết kế những khoảnh khắc mà mọi người không chỉ nhìn thấy mà còn cảm nhận được.',
          pills: ['UI/UX', '3D VISUALIZATION', 'DEVELOPMENT', '+'],
          scrollLabel: 'Cuộn để khám phá',
        },
        displayOrder: 0,
      },
      {
        pageId: homePage.id,
        sectionKey: 'home-stats',
        title: 'Thống kê nổi bật',
        contentJson: {
          items: [
            {
              icon: '/icon/icon-khach-hang-tin-dung.png',
              label: 'Được tin tưởng bởi',
              value: '100+ khách hàng, doanh nghiệp',
            },
            {
              icon: '/icon/icon-giao-dien.png',
              label: 'Có sẵn',
              value: '400+ giao diện đẹp, chuẩn SEO',
            },
            {
              icon: '/icon/icon-linh-vuc.png',
              label: 'Đáp ứng',
              value: '50+ lĩnh vực, ngành nghề',
            },
          ],
        },
        displayOrder: 1,
      },
      {
        pageId: homePage.id,
        sectionKey: 'home-services',
        title: 'STARTECH giúp gia tăng doanh số với SEO và Marketing',
        subtitle: 'Làm sao để có hàng trăm đơn hàng mới mỗi ngày từ website?',
        description: '/img/tang-doanh-so-ban-hang-voi-seo-marketing.png',
        contentJson: {
          items: [
            {
              icon: '/icon/icon-khach-hang-tin-dung.png',
              title: 'Hỗ trợ SEO mạnh mẽ',
              description: 'Tối ưu cấu trúc, Core Web Vitals, dễ dàng tùy chỉnh SEO onpage để đạt thứ hạng cao.',
            },
            {
              icon: '/icon/icon-khach-hang-tin-dung.png',
              title: 'Tăng hiệu quả quảng cáo',
              description: 'Trang đích tối ưu, tích hợp Google Ads và Facebook Ads giúp tiếp cận khách hàng hiệu quả.',
            },
            {
              icon: '/icon/icon-khach-hang-tin-dung.png',
              title: 'Tăng 30% tỷ lệ hoàn tất đơn',
              description: 'Abandoned checkout nhắc lại giỏ hàng, email marketing và coupon thúc đẩy chuyển đổi.',
            },
            {
              icon: '/icon/icon-khach-hang-tin-dung.png',
              title: 'Đo lường và phân tích',
              description: 'Báo cáo dữ liệu khách hàng và hành vi mua sắm giúp tối ưu chiến lược kịp thời.',
            },
          ],
        },
        displayOrder: 2,
      },
      {
        pageId: homePage.id,
        sectionKey: 'faq',
        title: 'Câu hỏi thường gặp',
        subtitle: 'Giải đáp nhanh cho khách hàng quan tâm về StarTech',
        description: 'Nội dung này được đưa vào database để dễ cập nhật và mở rộng sau này.',
        displayOrder: 1,
      },
      {
        pageId: websiteDesignPage.id,
        sectionKey: 'faq',
        title: 'Bạn hỏi - StarTech trả lời',
        subtitle: 'Những câu hỏi phổ biến về dịch vụ thiết kế website',
        description: 'Khối FAQ này là bước đầu tiên trong lộ trình chuyển hardcode content sang database.',
        displayOrder: 1,
      },
    ],
  });

  await prisma.pageSection.createMany({
    data: [
      {
        pageId: aboutPage.id,
        sectionKey: 'about-hero',
        title: 'Chúng tôi',
        description: 'Sở hữu những chiến binh giàu kinh nghiệm thực chiến',
        imageUrl: '/img/thiet-ke-web-site-tai-vinh-phuc-2.png',
        displayOrder: 0,
      },
      {
        pageId: aboutPage.id,
        sectionKey: 'about-intro',
        title: 'Chúng tôi là',
        description:
          'Đội ngũ StarTech với kinh nghiệm tham gia nhiều cuộc chiến trong nhiều năm liền ở thị trường Marketing, giờ đây chúng tôi chính thức là một đội quân hùng mạnh với mong muốn đồng hành và phát triển cùng bạn.',
        imageUrl: '/img/dich-vu-thiet-ke-website-xay-dung.png',
        displayOrder: 1,
      },
      {
        pageId: aboutPage.id,
        sectionKey: 'about-services',
        title: 'Làm việc tận tâm đã tạo nên uy tín cho STARTECH',
        subtitle: 'Những dịch vụ nổi bật',
        imageUrl: '/img/dich-vu-thiet-ke-website-xay-dung.png',
        primaryButtonLabel: 'Xem tất cả dịch vụ',
        primaryButtonHref: '/dich-vu',
        contentJson: {
          items: [
            'Thiết kế website',
            'Thiết kế sàn thương mại điện tử',
            'Thiết kế Mobile App',
            'Thiết kế Web App',
            'Dịch vụ SEO',
            'Quản trị website',
            'Hosting - Domain',
            'Dịch vụ quảng cáo đa kênh',
            'Thiết kế Branding - Thương hiệu',
            'Chụp hình thương hiệu',
            'Đăng ký website với Bộ Công Thương',
          ],
        },
        displayOrder: 2,
      },
      {
        pageId: aboutPage.id,
        sectionKey: 'about-highlights',
        title: 'VÌ SAO NÊN CHỌN LÀM VIỆC - SÁNG TẠO VỚI STARTECH?',
        imageUrl: '/img/professional-web-design-team.jpg',
        primaryButtonLabel: 'Tìm hiểu thêm',
        contentJson: {
          items: [
            'Đội ngũ chuyên gia giàu kinh nghiệm',
            'Công nghệ hiện đại, tiên tiến',
            'Giải pháp tùy chỉnh theo nhu cầu',
            'Hỗ trợ 24/7',
            'Bảo mật thông tin tuyệt đối',
            'Chi phí hợp lý, hiệu quả cao',
          ],
        },
        displayOrder: 3,
      },
      {
        pageId: aboutPage.id,
        sectionKey: 'about-values',
        title: 'Giá trị khác biệt tại STARTECH',
        subtitle: 'Không ngừng nỗ lực nâng cao chất lượng dịch vụ',
        description:
          'STARTECH sở hữu đội ngũ chiến binh dày dạn kinh nghiệm thực chiến trên thị trường Marketing. Chúng tôi luôn trong tâm thế sẵn sàng tham gia bất kỳ cuộc chiến nào cùng với doanh nghiệp bạn.',
        imageUrl: '/img/dich-vu-thiet-ke-website-xay-dung.png',
        primaryButtonLabel: 'Chiến lợi phẩm sau bao ngày ra trận của STARTECH',
        primaryButtonHref: '/du-an',
        secondaryButtonLabel: 'Liên hệ ngay',
        secondaryButtonHref: '/img/dich-vu-thiet-ke-website-xay-dung.png',
        contentJson: {
          videoDescription:
            'Chiến binh của chúng tôi không ngừng nỗ lực mang đến cho bạn những trải nghiệm dịch vụ tốt nhất, sẵn sàng hỗ trợ 24/7 để giải đáp mọi khó khăn trong quá trình sử dụng.',
          trophyDescription:
            'Đội ngũ STARTECH luôn tận tâm và nhiệt huyết nhằm đem đến những sản phẩm giá trị cho khách hàng. Nhờ vậy mà những dự án thiết kế website ra đời luôn vận hành thành công và hiệu quả.',
          values: [
            {
              number: '01',
              title: 'Sáng tạo',
              description: 'Sáng tạo trong phong cách thiết kế và luôn cập nhật xu hướng mới thường xuyên.',
            },
            {
              number: '02',
              title: 'Kinh nghiệm',
              description: 'Kinh nghiệm chiến đấu nhiều năm trên chiến trường Marketing giúp STARTECH hiểu rất rõ nhu cầu doanh nghiệp.',
            },
            {
              number: '03',
              title: 'Thấu hiểu',
              description: 'STARTECH dễ dàng nhìn nhận và thấu hiểu vấn đề một cách nhanh chóng để đưa ra hướng xử lý phù hợp.',
            },
            {
              number: '04',
              title: 'Đa dạng',
              description: 'Hệ sinh thái Marketing đa dịch vụ giúp STARTECH hỗ trợ doanh nghiệp toàn diện và bền vững.',
            },
          ],
          diversityItems: ['Sử dụng nhiều ngôn ngữ lập trình', 'Nhiều đối tác liên kết', 'Hệ sinh thái Marketing', 'Sáng tạo trong thiết kế'],
          ctaDescription: 'Ngay bây giờ chính là thời điểm sớm nhất để bắt đầu hành trình phát triển hiện diện số cùng STARTECH.',
          ctaLabel: 'Liên hệ ngay',
          ctaHref: '/lien-he',
        },
        displayOrder: 4,
      },
      {
        pageId: servicesPage.id,
        sectionKey: 'services-overview',
        title: 'Tổng quan dịch vụ',
        subtitle: 'Các nhóm dịch vụ doanh nghiệp có thể triển khai cùng STARTECH',
        description: 'Trang dịch vụ sẽ được admin quản lý từ database thay vì nhúng text cố định trong frontend.',
        displayOrder: 1,
      },
      {
        pageId: projectsPage.id,
        sectionKey: 'projects-overview',
        title: 'Tổng quan portfolio',
        subtitle: 'Những dự án tiêu biểu STARTECH đã triển khai',
        description: 'Trang dự án dùng page content từ database cho SEO, hero và các khối mô tả chung.',
        displayOrder: 1,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        pageId: homePage.id,
        question: 'STARTECH cung cấp dịch vụ gì?',
        answer: 'Thiết kế website, thương mại điện tử, phát triển ứng dụng và tự động hóa marketing.',
        displayOrder: 1,
      },
      {
        pageId: homePage.id,
        question: 'Thời gian triển khai bao lâu?',
        answer: 'Tùy dự án, website cơ bản từ 2 đến 4 tuần, ecommerce hoặc hệ thống phức tạp sẽ cần nhiều thời gian hơn.',
        displayOrder: 2,
      },
      {
        pageId: homePage.id,
        question: 'Có bảo trì sau triển khai không?',
        answer: 'Có. Chúng tôi cung cấp gói bảo trì, hỗ trợ vận hành và nâng cấp theo nhu cầu phát triển của doanh nghiệp.',
        displayOrder: 3,
      },
      {
        pageId: homePage.id,
        question: 'Chi phí được tính thế nào?',
        answer: 'Chi phí được xác định theo phạm vi tính năng, mức độ tùy biến và thời gian triển khai, luôn báo giá minh bạch trước khi bắt đầu.',
        displayOrder: 4,
      },
      {
        pageId: homePage.id,
        question: 'Có hỗ trợ nâng cấp mở rộng không?',
        answer: 'Kiến trúc module và phương pháp triển khai giúp website dễ mở rộng theo nhu cầu kinh doanh trong tương lai.',
        displayOrder: 5,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Thiết kế website là gì?',
        answer:
          'Thiết kế website là quá trình xây dựng giao diện, cấu trúc nội dung và hệ thống chức năng giúp doanh nghiệp giới thiệu sản phẩm, tiếp cận khách hàng và bán hàng trên Internet.',
        displayOrder: 1,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Thiết kế website chuẩn SEO là gì?',
        answer:
          'Website chuẩn SEO được tối ưu cấu trúc, tốc độ tải trang, heading, metadata và trải nghiệm người dùng để thân thiện với công cụ tìm kiếm.',
        displayOrder: 2,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Tại sao doanh nghiệp cần website chuyên nghiệp?',
        answer:
          'Website là bộ mặt thương hiệu online, hỗ trợ xây dựng uy tín, giới thiệu dịch vụ 24/7 và tăng khả năng chuyển đổi khách hàng tiềm năng.',
        displayOrder: 3,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Cần chuẩn bị gì khi làm website?',
        answer:
          'Cần có thông tin doanh nghiệp, logo, nội dung dịch vụ, cấu trúc trang và định hướng mục tiêu kinh doanh để triển khai nhanh và đúng hướng.',
        displayOrder: 4,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Thời gian làm website bao lâu?',
        answer: 'Website cơ bản thường từ 2 đến 3 tuần, website theo yêu cầu doanh nghiệp có thể cần từ 3 đến 7 tuần tùy độ phức tạp.',
        displayOrder: 5,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Chi phí thiết kế website được tính như thế nào?',
        answer: 'Chi phí phụ thuộc vào loại website, số lượng trang, mức độ tùy biến giao diện, tính năng và nhu cầu SEO hay nội dung đi kèm.',
        displayOrder: 6,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        pageId: servicesPage.id,
        question: 'STARTECH hiện có những dịch vụ nào?',
        answer: 'STARTECH cung cấp thiết kế website, website bán hàng, web app, SEO, quản trị website và các dịch vụ hỗ trợ triển khai online.',
        displayOrder: 1,
      },
      {
        pageId: servicesPage.id,
        question: 'Doanh nghiệp nên bắt đầu từ đâu?',
        answer:
          'Tùy mục tiêu kinh doanh, doanh nghiệp có thể bắt đầu từ website giới thiệu, landing page chuyển đổi hoặc website bán hàng để tạo kết quả nhanh nhất.',
        displayOrder: 2,
      },
      {
        pageId: projectsPage.id,
        question: 'Portfolio trên STARTECH có phải dự án thực tế không?',
        answer: 'Có. Đây là các dự án, mẫu triển khai và showcase STARTECH dùng để minh họa năng lực thiết kế, quản trị và triển khai website.',
        displayOrder: 1,
      },
      {
        pageId: projectsPage.id,
        question: 'Có thể yêu cầu thiết kế tương tự portfolio không?',
        answer: 'Có. Đội ngũ sẽ tư vấn dựa trên ngành hàng, mục tiêu kinh doanh và các dự án bạn tham khảo để đề xuất hướng giao diện phù hợp.',
        displayOrder: 2,
      },
    ],
  });

  await prisma.contactSubmission.createMany({
    data: [
      {
        name: 'Nguyễn Minh Anh',
        email: 'minhanh@example.com',
        phone: '0912345678',
        company: 'Công ty Nông sản Xanh',
        service: 'THIẾT KẾ WEBSITE',
        message: 'Tôi cần website giới thiệu doanh nghiệp và form nhận yêu cầu báo giá.',
        status: 'WAITING',
      },
      {
        name: 'Trần Hải Yến',
        email: 'haiyen@example.com',
        phone: '0987123456',
        company: 'Moonlook Beauty',
        service: 'THIẾT KẾ SÀN THƯƠNG MẠI ĐIỆN TỬ',
        message: 'Muốn nâng cấp website bán hàng hiện tại và tối ưu chuyển đổi trên mobile.',
        status: 'VIEWED',
      },
      {
        name: 'Lê Quốc Bình',
        email: 'quocbinh@example.com',
        phone: '0903555777',
        company: 'Bình Minh Education',
        service: 'DỊCH VỤ SEO',
        message: 'Cần SEO cho website khóa học online, đặc biệt là tối ưu landing page và blog.',
        status: 'PROCESSED',
      },
      {
        name: 'Phạm Thu Trang',
        email: 'thutrang@example.com',
        phone: '0938111222',
        company: 'An Tâm Dental',
        service: 'QUẢN TRỊ WEBSITE',
        message: 'Cần đội ngũ hỗ trợ cập nhật nội dung và chỉnh sửa banner định kỳ hàng tháng.',
        status: 'WAITING',
      },
      {
        name: 'Hoàng Gia Huy',
        email: 'giahuy@example.com',
        phone: '0977000111',
        company: 'Huy Phát Logistics',
        service: 'THIẾT KẾ WEB APP',
        message: 'Tôi muốn xây dựng hệ thống web app quản lý đơn hàng và điều phối nội bộ.',
        status: 'VIEWED',
      },
      {
        name: 'Đỗ Khánh Linh',
        email: 'khanhlinh@example.com',
        phone: '0944555666',
        company: 'Linh Decor',
        service: 'THIẾT KẾ WEBSITE',
        message: 'Cần website showcase portfolio nội thất và tối ưu trải nghiệm hình ảnh.',
        status: 'WAITING',
      },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { settingKey: 'site_name', settingVal: 'STARTECH', type: 'string' },
      { settingKey: 'site_tagline', settingVal: 'Đổi mới công nghệ, tối đa hiệu quả', type: 'string' },
      { settingKey: 'primary_contact_email', settingVal: 'kieukienquocbusiness@gmail.com', type: 'string' },
      {
        settingKey: 'public_navigation',
        settingVal: JSON.stringify({
          items: [
            { name: 'Trang chủ', href: '/' },
            { name: 'Dịch vụ', href: '/dich-vu' },
            { name: 'Dự án', href: '/du-an' },
            { name: 'Thiết kế website', href: '/thiet-ke-website' },
          ],
          socialLinks: [
            { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61581525345220' },
            { name: 'TikTok', href: 'https://www.tiktok.com/@kienquocz?lang=vi-VN' },
            { name: 'Instagram', href: 'https://www.instagram.com' },
            { name: 'YouTube', href: 'https://www.youtube.com' },
          ],
          ctaLabel: 'Liên hệ',
          ctaHref: '/lien-he',
          promoLabel: 'Kết nối với chúng tôi',
          promoTitle: 'STARTECH đồng hành cùng doanh nghiệp trên hành trình phát triển hiện diện số.',
        }),
        type: 'json',
      },
      {
        settingKey: 'public_footer',
        settingVal: JSON.stringify({
          companyDescription: 'STARTECH ra đời với sứ mệnh đồng hành và nâng tầm thương hiệu của bạn trên thị trường Internet.',
          officeInfo: [
            'Địa chỉ: 347/15 Huỳnh Văn Bánh, Phường 11, Phú Nhuận, Hồ Chí Minh, Việt Nam',
            'Số điện thoại: 0919 925 302',
            'Email: kieukienquocbusiness@gmail.com',
            'Thời gian hoạt động: Thứ 2 - Thứ 6 từ 8h30 - 17h30',
            'Thứ 7 từ 8h30 - 12h30',
          ],
          services: [
            { name: 'Hosting', href: '/dich-vu' },
            { name: 'Domain', href: '/dich-vu' },
            { name: 'Dịch vụ SEO', href: '/dich-vu' },
            { name: 'Thiết kế website', href: '/thiet-ke-website' },
            { name: 'Thiết kế Web App', href: '/dich-vu' },
            { name: 'Quản trị website', href: '/dich-vu' },
          ],
          socialLinks: [
            { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61581525345220' },
            { name: 'TikTok', href: 'https://www.tiktok.com/@kienquocz?lang=vi-VN' },
            { name: 'Instagram', href: 'https://www.instagram.com' },
            { name: 'YouTube', href: 'https://www.youtube.com' },
          ],
          copyright: '© 2026 STARTECH. Bản quyền thuộc về STARTECH.',
        }),
        type: 'json',
      },
      {
        settingKey: 'public_contact_form',
        settingVal: JSON.stringify({
          introText: 'STARTECH luôn tư vấn miễn phí. Hãy để lại thông tin để đội ngũ liên hệ và đề xuất giải pháp phù hợp.',
          services: [
            'THIẾT KẾ WEBSITE',
            'THIẾT KẾ SÀN THƯƠNG MẠI ĐIỆN TỬ',
            'THIẾT KẾ WEB APP',
            'DỊCH VỤ SEO',
            'QUẢN TRỊ WEBSITE',
            'DỊCH VỤ QUẢNG CÁO ĐA KÊNH',
          ],
          submitLabel: 'Gửi yêu cầu',
          successMessage: 'Cảm ơn bạn đã liên hệ. STARTECH sẽ phản hồi trong thời gian sớm nhất.',
        }),
        type: 'json',
      },
    ],
  });

  const adminEmail = await upsertAdminUser();

  console.log('✅ Seed dữ liệu hoàn thành!');
  console.log(`📊 Thống kê:
   • ${category.length} danh mục sản phẩm
   • ${serviceRecords.length} dịch vụ
   • ${products.length} sản phẩm
   • ${features.length} tính năng
   • ${pricingPlans.length} gói dịch vụ
   • 1 tài khoản quản trị (${adminEmail})`);
  console.warn('');
  console.warn('✅ Seed completed successfully!');
  console.warn('Login to admin: ' + adminEmail);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
