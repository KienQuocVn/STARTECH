'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#153e6a] to-[#1a63a8] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Bắt Đầu Dự Án Của Bạn</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
          Hãy để STARTECH biến ý tưởng của bạn thành hiện thực với những giải pháp công nghệ tốt
          nhất
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-[#1a63a8] hover:bg-white/90 font-semibold text-lg px-8"
        >
          <Link href="/lien-he">
            Liên Hệ Tư Vấn
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
