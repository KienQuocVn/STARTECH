'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Facebook, Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { createContact } from '@/lib/services/contact';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface CollapsibleSectionProps {
  id: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function TikTokIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5 0V9.1C5.5 9.83454 4.90192 10.4 4.125 10.4C3.34808 10.4 2.75 9.83454 2.75 9.1C2.75 8.36546 3.34808 7.8 4.125 7.8V5.2C1.86317 5.2 0 6.96154 0 9.1C0 11.2385 1.86317 13 4.125 13C6.38683 13 8.25 11.2385 8.25 9.1V4.20215C9.0972 4.77274 9.98129 5.2 11 5.2V2.6C10.9349 2.6 9.98618 2.31522 9.32422 1.76973C8.66226 1.22423 8.25 0.539488 8.25 0H5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CollapsibleSection({ id, title, children, className = '' }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateIsDesktop = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    updateIsDesktop(mediaQuery);

    const listener = (event: MediaQueryListEvent) => updateIsDesktop(event);
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`footer__title flex w-full items-center justify-between text-left ${className.includes('mt-') ? '' : 'mt-5'}`}
        aria-expanded={isOpen}
        aria-controls={`footer-section-${id}`}
      >
        <span>{title}</span>
        <span
          className={`footer-xemthem-btn flex h-6 w-6 items-center justify-center transition-transform duration-300 lg:hidden ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        id={`footer-section-${id}`}
        className={`overflow-hidden transition-all duration-300 lg:block ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
        }`}
      >
        {(isOpen || isDesktop) && children}
      </div>
    </div>
  );
}

const companyDescription =
  'StarTech ra đời với sứ mệnh đồng hành và nâng tầm thương hiệu của bạn trên thị trường Internet. Chúng tôi giúp bạn phát triển với sự hỗ trợ của hệ sinh thái các giải pháp Marketing toàn diện. Đặc biệt với dịch vụ thiết kế website chuyên nghiệp tại StarTech, bạn và doanh nghiệp bạn sẽ có bệ phóng vững chắc cho mọi hoạt động kinh doanh.';

const officeInfo = [
  'Địa chỉ: 347/15 Huỳnh Văn Bánh, Phường 11, Phú Nhuận, Hồ Chí Minh, Việt Nam',
  'Số điện thoại: 0919 925 302',
  'Email: kieukienquocbusiness@gmail.com',
  'Thời gian hoạt động: Thứ 2 - Thứ 6 từ 8h30 - 17h30',
  'Thứ 7 từ 8h30 - 12h30',
];

const services = [
  { name: 'Hosting', href: '#' },
  { name: 'Domain', href: '#' },
  { name: 'Dịch vụ SEO', href: '#' },
  { name: 'Thiết kế website', href: '#' },
  { name: 'Thiết kế Web App', href: '#' },
  { name: 'Quản trị website', href: '#' },
  { name: 'Thiết kế sàn thương mại điện tử', href: '#' },
  { name: 'Quảng cáo Google/Facebook (Ads)', href: '#' },
  { name: 'Thiết kế Branding- Thương hiệu', href: '#' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61581525345220',
    icon: <Facebook className="h-4 w-4" />,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com',
    icon: <Youtube className="h-4 w-4" />,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com',
    icon: <Instagram className="h-4 w-4" />,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@kienquocz?lang=vi-VN',
    icon: <TikTokIcon />,
  },
];

function QuoteForm({
  formData,
  setFormData,
  handleSubmit,
}: {
  formData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    agree: boolean;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      company: string;
      email: string;
      phone: string;
      service: string;
      message: string;
      agree: boolean;
    }>
  >;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <>
      <p className="mt-3 mb-4 text-sm text-gray-600">
        StarTech luôn tư vấn dịch vụ miễn phí. Chúng tôi sẽ liên hệ báo giá theo thông tin mà bạn để
        lại.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Họ tên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-gray-300 bg-white"
          required
        />
        <Input
          placeholder="Công ty"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="border-gray-300 bg-white"
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="border-gray-300 bg-white"
        />
        <Input
          type="tel"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="border-gray-300 bg-white"
        />
        <Select
          value={formData.service}
          onValueChange={(value) => setFormData({ ...formData, service: value })}
        >
          <SelectTrigger className="border-gray-300 bg-white">
            <SelectValue placeholder="Chọn dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.name} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Nội dung tin nhắn"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="border-gray-300 bg-white"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#80d8f9] to-[#1a63a8] transition-all duration-300 hover:shadow-lg"
        >
          Gửi
        </Button>
      </form>
    </>
  );
}

export function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    agree: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const subscribeToNewsletter = async (email: string) => {
    try {
      const newsletterFormData = new FormData();
      newsletterFormData.append('subscriber', email);

      await fetch(
        'https://mail9057.maychuemail.com:1000/newsletter/subscribe/6b4f262a-18eb-42e9-a747-8002a32d00d3',
        {
          method: 'POST',
          body: newsletterFormData,
          mode: 'no-cors',
        },
      );

      return true;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || hasSubmitted) {
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const contactData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service: formData.service || 'Chưa chọn',
        message: formData.message,
      };

      const result = await createContact(contactData);

      if (formData.agree) {
        await subscribeToNewsletter(formData.email);
      }

      console.log('Contact form submitted successfully:', result);

      toast.success(
        'Cảm ơn bạn đã liên hệ với StarTech. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      );

      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        agree: true,
      });

      setTimeout(() => {
        setHasSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setHasSubmitted(false);
      toast.error('Đã xảy ra lỗi khi gửi biểu mẫu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-16">
        <div className="space-y-4 lg:hidden">
          <Image src="/icon/logo.png" alt="STARTECH" width={200} height={63} className="mb-4" />
          <CollapsibleSection id={0} title="" className="mt-0">
            <div className="mt-3">
              <div className="footer-mobile-hidden--content mt-3 text-sm text-gray-600">
                {companyDescription}
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection id={1} title="Trụ sở chính" className="mt-0">
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              {officeInfo.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection id={2} title="Dịch vụ" className="mt-0">
            <div className="mt-3 space-y-2">
              {services.map((service) => (
                <a
                  key={service.name}
                  href={service.href}
                  className="footer__link block text-sm text-gray-600 transition-colors duration-300 hover:text-[#1a63a8]"
                >
                  {service.name}
                </a>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection id={3} title="Kết nối với chúng tôi" className="mt-0">
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="footer__social inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#1a63a8] hover:to-[#70efd1] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection id={4} title="Gửi yêu cầu báo giá dịch vụ" className="mt-0">
            <QuoteForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
          </CollapsibleSection>
        </div>

        <div className="hidden grid-cols-1 gap-8 lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="footer__col">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon/logo.png"
                alt="STARTECH"
                width={200}
                height={63}
                className="transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <div className="footer__desc mb-6 text-gray-600">{companyDescription}</div>

            <CollapsibleSection id={5} title="Trụ sở chính">
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {officeInfo.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          <div className="footer__col">
            <CollapsibleSection id={6} title="Dịch vụ" className="mt-0">
              <div className="mt-3 space-y-2">
                {services.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    className="footer__link block text-sm text-gray-600 transition-colors duration-300 hover:text-[#1a63a8]"
                  >
                    {service.name}
                  </a>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection id={7} title="Kết nối với chúng tôi" className="mt-4">
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="footer__social inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#1a63a8] hover:to-[#70efd1] hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          <div className="footer__col footer__col--form">
            <div className="footer__title">Gửi yêu cầu báo giá dịch vụ</div>
            <QuoteForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200/80 px-6 py-4">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          Copyright © 2026 STARTECH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
