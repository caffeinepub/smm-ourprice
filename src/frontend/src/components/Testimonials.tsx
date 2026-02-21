import { useGetAllTestimonials } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Users, ThumbsUp, Eye } from 'lucide-react';
import { ServiceType } from '../backend';

const serviceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.followers]: 'متابعون',
  [ServiceType.likes]: 'إعجابات',
  [ServiceType.views]: 'مشاهدات',
};

const serviceTypeIcons: Record<ServiceType, React.ReactNode> = {
  [ServiceType.followers]: <Users className="h-4 w-4" />,
  [ServiceType.likes]: <ThumbsUp className="h-4 w-4" />,
  [ServiceType.views]: <Eye className="h-4 w-4" />,
};

export default function Testimonials() {
  const { data: testimonials, isLoading } = useGetAllTestimonials();

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-black to-gray-950 py-16">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-64" />
            <Skeleton className="mx-auto h-6 w-96" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-black to-gray-950 py-16">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-black tracking-tight">
            <span className="text-white">آراء</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              عملائنا
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            اكتشف ما يقوله عملاؤنا الراضون عن خدماتنا
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-cyan-500/20 bg-black/40 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-400">
                    {serviceTypeIcons[testimonial.serviceType]}
                    <span>{serviceTypeLabels[testimonial.serviceType]}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Number(testimonial.rating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mb-4 text-gray-300 leading-relaxed">
                  "{testimonial.testimonialText}"
                </p>

                <div className="border-t border-cyan-500/20 pt-4">
                  <p className="font-semibold text-white">
                    {testimonial.customerName}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
