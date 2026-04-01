"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { SiteFaqItem } from "@/lib/services/site-content"
import Image from "next/image"

const fallbackFaqs = [
  { q: "STARTECH cung cap dich vu gi?", a: "Thiet ke website, thuong mai dien tu, phat trien ung dung va tu dong hoa marketing." },
  { q: "Thoi gian trien khai bao lau?", a: "Tuy du an, website co ban 2 den 4 tuan, ecommerce hoac app se lau hon." },
  { q: "Co bao tri sau trien khai khong?", a: "Co. Chung toi cung cap goi bao tri va ho tro 24/7." },
  { q: "Chi phi duoc tinh the nao?", a: "Theo pham vi tinh nang va thoi gian thuc hien; luon minh bach truoc khi bat dau." },
  { q: "Co ho tro nang cap mo rong?", a: "Kien truc module cho phep mo rong de dang theo nhu cau doanh nghiep." },
]

interface FAQProps {
  items?: SiteFaqItem[]
}

export function FAQ({ items = [] }: FAQProps) {
  const faqs = items.length ? items.map((item) => ({ q: item.question, a: item.answer })) : fallbackFaqs

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="order-2 md:order-1">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem value={`item-${i}`} key={i} data-reveal>
                <AccordionTrigger className="text-left text-[#2F4858]">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[#286478]">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="order-1 md:order-2">
          <Image src="/img/professional-web-design-team.jpg" alt="STARTECH team" width={900} height={700} className="rounded-2xl shadow-md" />
        </div>
      </div>
    </section>
  )
}
