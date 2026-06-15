const TESTIMONIALS = [
  {
    text: '"I felt sharper by the second week — and I never remember to take vitamins. The subscription cadence is exactly right."',
    author: "Priya R.",
    location: "Austin, TX",
  },
  {
    text: '"Tried three other greens powders before this. This is the first one that doesn\'t taste like pond water."',
    author: "Daniel K.",
    location: "Brooklyn, NY",
  },
  {
    text: '"Customer service refunded me without making it weird when I asked. Then I re-ordered a month later."',
    author: "Lena S.",
    location: "Denver, CO",
  },
];

export function ReviewsSection() {
  return (
    <div data-section="reviews" className="bg-white rounded-[10px] p-4 mb-3">
      {/* Rating header */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#f0ece4]">
        <span className="text-[#e8a020] text-[15px] tracking-[1px]">
          ★★★★★
        </span>
        <span className="font-extrabold text-[16px] text-[#1a3028]">4.86</span>
        <span className="text-[11px] text-[#888]">· 12,408 verified reviews</span>
        <span className="text-[9px] text-[#bbb] uppercase tracking-[0.08em] ml-auto">
          Verified by Stamped
        </span>
      </div>

      {/* Testimonial tiles */}
      <div className="grid grid-cols-3 gap-2">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.author}
            className="bg-[#fafaf8] rounded-[8px] p-[11px] text-[11px] text-[#444] leading-[1.55]"
          >
            {t.text}
            <div className="mt-2 font-bold text-[10px] text-[#1a3028]">
              {t.author}{" "}
              <span className="text-[#3a6a4a] font-medium">✓ Verified</span>
            </div>
            <div className="text-[10px] text-[#888]">{t.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
