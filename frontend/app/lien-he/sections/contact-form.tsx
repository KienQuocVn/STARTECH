"use client"

import { useState } from "react"
import { Checkbox } from "../../../components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoveRight } from "lucide-react"
import { toast } from 'sonner';
import { createContact } from "@/lib/services/contact"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    company: "",
    description: "",
    agree: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const services = [
    { value: "WEBSITE BÁN HÀNG", label: "WEBSITE BÁN HÀNG" },
    { value: "WEBSITE DOANH NGHIỆP", label: "WEBSITE DOANH NGHIỆP" },
    { value: "LANDINGPAGE", label: "LANDINGPAGE" },
    { value: "3D Animation", label: "3D Animation" },
  ]

  const subscribeToNewsletter = async (email: string) => {
    try {
      const formData = new FormData();
      formData.append('subscriber', email);

      await fetch('https://mail9057.maychuemail.com:1000/newsletter/subscribe/6b4f262a-18eb-42e9-a747-8002a32d00d3', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      return true;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting || hasSubmitted) {
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return
    }

    setIsSubmitting(true)
    setHasSubmitted(true)

    try {
      const contactData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service: formData.service || "Chưa chọn",
        message: formData.description || "Khách hàng cần tư vấn thêm.",
      }
      await createContact(contactData)

      if (formData.agree) {
        await subscribeToNewsletter(formData.email);
      }

      toast.success("Cảm ơn bạn đã liên hệ với StarTech. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.");

      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        company: "",
        description: "",
        agree: true,
      })

      setTimeout(() => {
        setHasSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setHasSubmitted(false);
      toast.error("Đã xảy ra lỗi khi gửi biểu mẫu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="name" className="text-sm sm:text-base">Họ và tên đầy đủ*</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-none border-0 border-b border-gray-400 bg-transparent text-sm focus:border-b-2 focus:border-black sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor="company" className="text-sm sm:text-base">Công ty</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="rounded-none border-0 border-b border-gray-400 bg-transparent text-sm focus:border-b-2 focus:border-black sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="rounded-none border-0 border-b border-gray-400 bg-transparent text-sm focus:border-b-2 focus:border-black sm:text-base"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm sm:text-base">Điện thoại*</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="rounded-none border-0 border-b border-gray-400 bg-transparent text-sm focus:border-b-2 focus:border-black sm:text-base"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="service" className="text-sm sm:text-base">Tôi quan tâm đến</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((svc) => (
            <Button
              key={svc.value}
              type="button"
              variant={formData.service === svc.value ? "default" : "outline"}
              className={`rounded-full px-4 text-xs sm:px-5 sm:text-sm ${formData.service === svc.value ? 'bg-black text-white' : 'border-black text-black'}`}
              onClick={() => setFormData({ ...formData, service: svc.value })}
            >
              {svc.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-sm sm:text-base">Hãy cho chúng tôi biết thêm về dự án của bạn!</Label>
        <Textarea
          id="description"
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="rounded-none border-0 border-b border-gray-400 bg-transparent text-sm focus:border-b-2 focus:border-black sm:text-base"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="agree"
          checked={formData.agree}
          onCheckedChange={(checked) => setFormData({ ...formData, agree: !!checked })}
          className="mt-1 border-gray-400 focus:ring-0 focus:ring-offset-0 focus:ring-transparent"
        />
        <Label htmlFor="agree" className="text-sm leading-6 sm:text-base">Nhận thông tin mới nhất từ StarTech</Label>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-full bg-black text-base font-semibold text-white sm:h-14 sm:text-lg"
      >
        SEND <MoveRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </form>
  )
}
