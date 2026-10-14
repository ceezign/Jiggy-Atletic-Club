import { Testimonial } from "@/types";
import { Quote } from "lucide-react";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="rounded-soft border border-white/10 bg-surface p-6 flex flex-col h-full">
      <Quote className="w-6 h-6 text-violet mb-4" strokeWidth={1.5} />
      <p className="text-sm text-ivory/90 leading-relaxed flex-1">&ldquo;{testimonial.review}&rdquo;</p>
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="text-sm font-semibold text-ivory">{testimonial.MemberName}</div>
        {testimonial.MembershipType && (
          <div className="text-xs text-muted mt-0.5">{testimonial.MembershipType} Member</div>
        )}
      </div>
    </div>
  );
}
