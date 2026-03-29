import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SiteFaqItem } from "@/lib/services/site-content";

const fallbackFaqs = [
  {
    question: "Thiet ke website la gi?",
    answer:
      "Thiet ke website la qua trinh tao ra giao dien va he thong chuc nang cho mot trang web, giup doanh nghiep gioi thieu san pham, tiep can khach hang va ban hang hieu qua tren Internet.",
  },
  {
    question: "Thiet ke website chuan SEO la gi?",
    answer:
      "Thiet ke website chuan SEO la tao ra website co cau truc than thien voi cong cu tim kiem, toc do tai trang nhanh va toi uu trai nghiem nguoi dung.",
  },
  {
    question: "Tai sao can website chuyen nghiep cho doanh nghiep?",
    answer:
      "Website la bo mat thuong hieu online, giup xay dung uy tin, tiep can khach hang 24/7 va tang kha nang chuyen doi.",
  },
  {
    question: "Can chuan bi gi khi thiet ke website?",
    answer:
      "Can co thong tin doanh nghiep, logo, noi dung san pham dich vu va dinh huong muc tieu kinh doanh de trien khai nhanh va ro rang.",
  },
  {
    question: "Chi phi thiet ke website duoc tinh the nao?",
    answer:
      "Chi phi phu thuoc vao so luong trang, muc do tuy bien giao dien, tinh nang va yeu cau SEO/noi dung di kem.",
  },
]

interface FAQSectionProps {
  items?: SiteFaqItem[]
}

export function FAQSection({ items = [] }: FAQSectionProps) {
  const faqs = items.length ? items : fallbackFaqs

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[#1a63a8] uppercase tracking-wide text-sm sm:text-base font-semibold mb-2">
            Giai dap thac mac khi thiet ke web tai StarTech
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase font-bold mb-4 text-gray-900">
            Ban hoi - StarTech tra loi
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ban can hieu them ve <strong>dich vu thiet ke website</strong> cua StarTech?
            Tham khao cac loi giai dap duoi day nhe!
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-[#faf5f0] rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
            >
              <AccordionTrigger className="px-5 sm:px-6 py-4 sm:py-5 text-left font-semibold text-gray-800 text-base sm:text-lg hover:no-underline focus:outline-none transition-all data-[state=open]:bg-gradient-to-r data-[state=open]:from-[#1a63a8] data-[state=open]:to-[#70caef] data-[state=open]:text-white rounded-t-2xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-5 sm:px-6 pb-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
