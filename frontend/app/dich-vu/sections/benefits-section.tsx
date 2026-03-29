import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Palette, Smartphone, Zap, Shield, TrendingUp } from 'lucide-react';

const benefits = [
  { icon: Code, title: 'Chuẩn SEO', description: 'Tối ưu công cụ tìm kiếm, dễ lên top Google' },
  { icon: Palette, title: 'Thiết kế đa dạng', description: 'Giao diện đẹp, phù hợp từng ngành nghề' },
  { icon: Smartphone, title: 'Đa nền tảng', description: 'Responsive hoàn hảo trên mọi thiết bị' },
  { icon: Zap, title: 'Tốc độ cao', description: 'Tối ưu tải trang, trải nghiệm mượt mà' },
  { icon: Shield, title: 'Bảo mật', description: 'SSL miễn phí, bảo vệ dữ liệu an toàn' },
  { icon: TrendingUp, title: 'Chuẩn UI/UX', description: 'Theo xu hướng, tăng tỉ lệ chuyển đổi' },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Lợi Ích Khi Làm Website Với STARTECH</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Những giá trị nổi bật bạn nhận được</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger>
          {benefits.map((benefit, index) => (
            <Card key={index} className="border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#1a63a8' }}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
