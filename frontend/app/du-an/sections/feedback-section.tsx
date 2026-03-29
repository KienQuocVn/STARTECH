'use client';

import { FormEvent, useState } from 'react';
import { createFeedback, type CreateFeedbackRequest } from '@/lib/services/feedback';

type FeedbackFormValues = {
  name: string;
  email: string;
  message: string;
  rating: string;
};

function getFeedbackFormValues(form: HTMLFormElement): FeedbackFormValues {
  const formData = new FormData(form);

  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    rating: String(formData.get('rating') ?? '5'),
  };
}

export default function FeedbackSection() {
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = getFeedbackFormValues(form);

    try {
      setFeedbackSubmitting(true);

      const feedbackData: CreateFeedbackRequest = {
        name: data.name || 'Ẩn danh',
        comment: data.message || '',
        rating: Number(data.rating || 5),
      };

      const response = await createFeedback(feedbackData);

      if (response.success) {
        form.reset();
        alert('Cảm ơn bạn đã gửi đánh giá!');
      } else {
        alert('Không thể gửi đánh giá. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi feedback:', err);
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <section className="bg-muted/30 py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl p-5 sm:p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_50%_at_30%_0%,rgba(26,99,168,0.08),transparent_60%)]" />
          <div className="absolute inset-0 -z-10 rounded-2xl border border-[#1a63a8] bg-white/10 backdrop-blur dark:bg-white/5" />

          <div className="mb-8 text-center">
            <h3 className="mb-2 text-2xl font-bold sm:text-3xl">Gửi đánh giá của bạn</h3>
            <p className="text-base text-muted-foreground sm:text-lg">
              Chúng tôi trân trọng mọi ý kiến để cải thiện dịch vụ và website
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Họ và tên *</label>
              <input
                name="name"
                required
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-[#1a63a8]/30 bg-white/90 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#1a63a8] dark:bg-white/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className="w-full rounded-lg border border-[#1a63a8]/30 bg-white/90 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#1a63a8] dark:bg-white/10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">Điểm đánh giá *</label>
              <div className="flex flex-wrap items-center gap-2" data-star-group>
                <input type="hidden" name="rating" defaultValue={5} />
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-star={n}
                    aria-label={`Chọn ${n} sao`}
                    className="text-3xl leading-none text-[#d1d5db] transition-colors duration-200 hover:scale-110 hover:text-[#f59e0b]"
                  >
                    ★
                  </button>
                ))}
                <span className="ml-1 text-sm text-muted-foreground">(Bắt buộc)</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">Nội dung đánh giá *</label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Trải nghiệm của bạn với STARTECH và website..."
                className="w-full resize-none rounded-lg border border-[#1a63a8]/30 bg-white/90 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#1a63a8] dark:bg-white/10"
              />
            </div>

            <div className="flex justify-center pt-4 md:col-span-2">
              <button
                type="submit"
                disabled={feedbackSubmitting}
                className="rounded-full bg-[#1a63a8] px-6 py-3 text-base font-semibold text-white shadow-[0_10px_30px_-10px_#1a63a8] transition-all duration-300 hover:brightness-110 hover:shadow-[0_15px_40px_-10px_#1a63a8] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:text-lg"
              >
                {feedbackSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang gửi...
                  </span>
                ) : (
                  'Gửi đánh giá'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
