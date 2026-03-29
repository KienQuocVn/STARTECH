'use client';

import { Application } from '@splinetool/runtime';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function Blog() {
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = React.useState<Application | null>(null);

  useEffect(() => {
    if (!splineApp) return;

    // Tìm object trong scene (vd: robot)
    const robotObject = splineApp.findObjectByName('robot');
    if (robotObject) {
      gsap.fromTo(
        robotObject.position,
        { y: -200 },
        {
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: splineContainer.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }
  }, [splineApp]);

  // ⚙️ Ngăn zoom trong vùng Spline
  useEffect(() => {
    const container = splineContainer.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      // Ngăn zoom Spline nhưng không ảnh hưởng cuộn trang
      event.stopPropagation();
      event.preventDefault();
    };

    // Khi con trỏ nằm trên vùng 3D -> chặn cuộn
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2F4858]">
          BẢNG GIÁ DỊCH VỤ THIẾT KẾ WEBSITE CHUYÊN NGHIỆP TRỌN GÓI
        </h2>
        <p className="text-center text-[#286478] mb-12 max-w-2xl mx-auto">
          Tham khảo bảng giá thiết kế website trọn gói, tối ưu chi phí cho từng nhu cầu doanh
          nghiệp. Cam kết giao diện chuyên nghiệp, chuẩn SEO và bảo hành dài hạn.
        </p>
      </div>
    </section>
  );
}
