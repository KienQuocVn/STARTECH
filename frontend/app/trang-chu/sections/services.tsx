import { Card } from '@/components/ui/card';
import type { HomeServiceItem } from '@/lib/content/homepage';

interface ServicesProps {
  eyebrow: string;
  title: string;
  image: string;
  items: HomeServiceItem[];
}

export function Services({ eyebrow, title, image, items }: ServicesProps) {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center text-xs font-medium uppercase tracking-[0.18em] text-[#286478] sm:text-sm">
          {eyebrow}
        </div>
        <h2 className="mx-auto mt-3 max-w-4xl text-center text-3xl font-bold leading-tight text-[#2F4858] sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <div className="relative mx-auto mt-10 max-w-5xl" data-reveal>
          <Card className="overflow-hidden rounded-[28px] shadow-xl">
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="h-auto w-full object-cover"
              />
            </div>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="mx-auto flex max-w-[240px] flex-col items-center space-y-3 text-center"
              data-reveal
              data-delay={index * 0.05}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00A1A6]/10 sm:h-12 sm:w-12">
                <img src={item.icon} alt={item.title} className="h-5 w-5 object-contain sm:h-6 sm:w-6" />
              </div>
              <div className="text-lg font-semibold leading-snug text-[#2F4858] sm:text-xl">{item.title}</div>
              <p className="text-sm leading-7 text-[#286478] sm:text-[15px]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
