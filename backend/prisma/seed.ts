import { PrismaClient, Prisma, PriceType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function toSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
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
  await prisma.pricing_feature.deleteMany();
  await prisma.product_service.deleteMany();
  await prisma.images.deleteMany();
  await prisma.product_cat.deleteMany();
  await prisma.contact_submission.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.product.deleteMany();
  await prisma.showcase_item.deleteMany();
  await prisma.services.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.pricing_plan.deleteMany();
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
    prisma.services.create({ data: { name: 'THIẾT KẾ WEBSITE' } }),
    prisma.services.create({ data: { name: 'THIẾT KẾ SÀN THƯƠNG MẠI ĐIỆN TỬ' } }),
    prisma.services.create({ data: { name: 'THIẾT KẾ WEB APP' } }),
    prisma.services.create({ data: { name: 'DỊCH VỤ SEO' } }),
    prisma.services.create({ data: { name: 'QUẢN TRỊ WEBSITE' } }),
    prisma.services.create({ data: { name: 'HOSTING' } }),
    prisma.services.create({ data: { name: 'DOMAIN' } }),
    prisma.services.create({ data: { name: 'DỊCH VỤ QUẢNG CÁO ĐA KÊNH' } }),
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
  await prisma.product_cat.createMany({
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
      await prisma.product_service.create({
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
      await prisma.images.create({
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
  await prisma.showcase_item.createMany({
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
        description:
          'Website được thiết kế đẹp mắt với nội dung gọn gàng, hình ảnh mô tả đất nước Bồ Đào Nha sống động được lồng ghép tinh tế',
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
        description:
          'Website thiết kế cung cấp thông tin và tin tức điện lực, kết hợp tính năng tra cứu và thanh toán hóa đơn trực tuyến',
        display_order: 9,
      },
      {
        image_url: '/img/DB_ACOUSTIC.webp',
        name: 'SỐNG ĐỘNG VỚI NHỮNG THIẾT BỊ ÂM THANH ĐƯỢC BÁN TẠI DB ACOUSTIC',
        description:
          'Trang web bán các thiết bị âm thanh trực tuyến, giao diện dễ sử dụng giúp khách hàng đặt mua thuận tiện',
        display_order: 10,
      },
      {
        image_url: '/img/HELIOCARE.webp',
        name: 'NÂNG TẦM SẮC VÓC VỚI SẢN PHẨM CHĂM SÓC DA TẠI WEB HELIOCARE',
        description:
          'Màu sắc tươi mới, sản phẩm nổi bật, tính năng flash sale hấp dẫn thu hút nhiều khách hàng',
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
        description:
          'Website chuyên nghiệp, tích hợp tính năng bán hàng giúp tăng hiệu quả tiếp cận khách hàng',
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
    prisma.pricing_plan.create({
      data: {
        name: 'Gói Cơ bản',
        price: new Prisma.Decimal('8000000'),
        price_Type: PriceType.FIXED,
        description: 'Phù hợp cho doanh nghiệp nhỏ, startup mới bắt đầu',
      },
    }),
    prisma.pricing_plan.create({
      data: {
        name: 'Gói Tiêu chuẩn',
        price: new Prisma.Decimal('15000000'),
        price_Type: PriceType.FIXED,
        description: 'Dành cho doanh nghiệp vừa với nhu cầu tính năng đa dạng',
      },
    }),
    prisma.pricing_plan.create({
      data: {
        name: 'Gói Chuyên nghiệp',
        price: new Prisma.Decimal('25000000'),
        price_Type: PriceType.FIXED,
        description: 'Giải pháp toàn diện cho doanh nghiệp lớn',
      },
    }),
    prisma.pricing_plan.create({
      data: {
        name: 'Gói Doanh nghiệp',
        price: new Prisma.Decimal('40000000'),
        price_Type: PriceType.FIXED,
        description: 'Gói cao cấp với tính năng tùy chỉnh theo yêu cầu',
      },
    }),
    prisma.pricing_plan.create({
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
    await prisma.pricing_feature.create({
      data: {
        pricing_plan_id: pricingPlans[0].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói Tiêu chuẩn: 6 tính năng
  for (let i = 0; i < 6; i++) {
    await prisma.pricing_feature.create({
      data: {
        pricing_plan_id: pricingPlans[1].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói Chuyên nghiệp: 8 tính năng
  for (let i = 0; i < 8; i++) {
    await prisma.pricing_feature.create({
      data: {
        pricing_plan_id: pricingPlans[2].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói Doanh nghiệp: 9 tính năng
  for (let i = 0; i < 9; i++) {
    await prisma.pricing_feature.create({
      data: {
        pricing_plan_id: pricingPlans[3].id,
        feature_id: features[i].id,
      },
    });
  }
  // Gói VIP: tất cả tính năng
  for (let i = 0; i < features.length; i++) {
    await prisma.pricing_feature.create({
      data: {
        pricing_plan_id: pricingPlans[4].id,
        feature_id: features[i].id,
      },
    });
  }

  console.log('Creating dynamic site content...')
  const homePage = await prisma.sitePage.create({
    data: {
      slug: 'home',
      title: 'Trang chu',
      seoTitle: 'STARTECH - Thiet ke website, marketing va portfolio du an',
      seoDescription:
        'STARTECH cung cap dich vu thiet ke website, marketing, portfolio du an thuc te va giai phap phat trien thuong hieu online.',
      heroBadge: 'Ho tro tang truong so',
      heroTitle: 'Giai phap thiet ke website va marketing cho doanh nghiep',
      heroDescription:
        'Trang chu tap trung trinh bay nang luc, du an noi bat, dich vu, showcase va FAQ nham tang niem tin va chuyen doi khach hang.',
    },
  });

  const websiteDesignPage = await prisma.sitePage.create({
    data: {
      slug: 'thiet-ke-website',
      title: 'Thiet ke website',
      seoTitle: 'Dich vu thiet ke website chuyen nghiep, chuan SEO tai STARTECH',
      seoDescription:
        'Dich vu thiet ke website chuyen nghiep, chuan SEO, trien khai tron goi va toi uu hieu qua kinh doanh online cho doanh nghiep.',
      heroBadge: 'Dich vu thiet ke website',
      heroTitle: 'Thiet ke website chuyen nghiep, chuan SEO va toi uu chuyen doi',
      heroDescription:
        'Landing page thiet ke website duoc dinh huong de gioi thieu nang luc, bang gia, quy trinh va giai dap thac mac mot cach ro rang.',
    },
  });

  await prisma.pageSection.createMany({
    data: [
      {
        pageId: homePage.id,
        sectionKey: 'faq',
        title: 'Cau hoi thuong gap',
        subtitle: 'Giai dap nhanh cho khach hang quan tam ve StarTech',
        description: 'Noi dung nay duoc dua vao database de de cap nhat va mo rong sau nay.',
        displayOrder: 1,
      },
      {
        pageId: websiteDesignPage.id,
        sectionKey: 'faq',
        title: 'Ban hoi - StarTech tra loi',
        subtitle: 'Nhung cau hoi pho bien ve dich vu thiet ke website',
        description: 'Khoi FAQ nay la buoc dau tien trong lo trinh chuyen hardcode content sang database.',
        displayOrder: 1,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        pageId: homePage.id,
        question: 'STARTECH cung cap dich vu gi?',
        answer: 'Thiet ke website, thuong mai dien tu, phat trien ung dung va tu dong hoa marketing.',
        displayOrder: 1,
      },
      {
        pageId: homePage.id,
        question: 'Thoi gian trien khai bao lau?',
        answer: 'Tuy du an, website co ban tu 2 den 4 tuan, ecommerce hoac he thong phuc tap se can nhieu thoi gian hon.',
        displayOrder: 2,
      },
      {
        pageId: homePage.id,
        question: 'Co bao tri sau trien khai khong?',
        answer: 'Co. Chung toi cung cap goi bao tri, ho tro van hanh va nang cap theo nhu cau phat trien cua doanh nghiep.',
        displayOrder: 3,
      },
      {
        pageId: homePage.id,
        question: 'Chi phi duoc tinh the nao?',
        answer: 'Chi phi duoc xac dinh theo pham vi tinh nang, muc do tuy bien va thoi gian trien khai, luon bao gia minh bach truoc khi bat dau.',
        displayOrder: 4,
      },
      {
        pageId: homePage.id,
        question: 'Co ho tro nang cap mo rong khong?',
        answer: 'Kien truc module va phuong phap trien khai giup website de mo rong theo nhu cau kinh doanh trong tuong lai.',
        displayOrder: 5,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Thiet ke website la gi?',
        answer: 'Thiet ke website la qua trinh xay dung giao dien, cau truc noi dung va he thong chuc nang giup doanh nghiep gioi thieu san pham, tiep can khach hang va ban hang tren Internet.',
        displayOrder: 1,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Thiet ke website chuan SEO la gi?',
        answer: 'Website chuan SEO duoc toi uu cau truc, toc do tai trang, heading, metadata va trai nghiem nguoi dung de than thien voi cong cu tim kiem.',
        displayOrder: 2,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Tai sao doanh nghiep can website chuyen nghiep?',
        answer: 'Website la bo mat thuong hieu online, ho tro xay dung uy tin, gioi thieu dich vu 24/7 va tang kha nang chuyen doi khach hang tiem nang.',
        displayOrder: 3,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Can chuan bi gi khi lam website?',
        answer: 'Can co thong tin doanh nghiep, logo, noi dung dich vu, cau truc trang va dinh huong muc tieu kinh doanh de trien khai nhanh va dung huong.',
        displayOrder: 4,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Thoi gian lam website bao lau?',
        answer: 'Website co ban thuong tu 2 den 3 tuan, website theo yeu cau doanh nghiep co the can tu 3 den 7 tuan tuy do phuc tap.',
        displayOrder: 5,
      },
      {
        pageId: websiteDesignPage.id,
        question: 'Chi phi thiet ke website duoc tinh nhu the nao?',
        answer: 'Chi phi phu thuoc vao loai website, so luong trang, muc do tuy bien giao dien, tinh nang va nhu cau SEO hay noi dung di kem.',
        displayOrder: 6,
      },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { settingKey: 'site_name', settingVal: 'STARTECH', type: 'string' },
      { settingKey: 'site_tagline', settingVal: 'Doi moi cong nghe, toi da hieu qua', type: 'string' },
      { settingKey: 'primary_contact_email', settingVal: 'contact@startech.local', type: 'string' },
    ],
  });

  const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@startech.local';
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'Startech@2026';
  const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);

  await prisma.user.create({
    data: {
      email: defaultAdminEmail,
      fullName: 'STARTECH Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Seed dữ liệu hoàn thành!');
  console.log(`📊 Thống kê:
   • ${category.length} danh mục sản phẩm
   • ${serviceRecords.length} dịch vụ
   • ${products.length} sản phẩm
   • ${features.length} tính năng
   • ${pricingPlans.length} gói dịch vụ
   • 1 tài khoản quản trị mặc định (${defaultAdminEmail})`);
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

