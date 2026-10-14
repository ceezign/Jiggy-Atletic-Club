import { Target, Users, Trophy } from "lucide-react";

export const metadata = { title: "About Us" };

const VALUES = [
  {
    icon: Target,
    title: "Results, not gimmicks",
    body: "We build programs around fundamentals that actually work — progressive overload, consistency, and recovery — not fads.",
  },
  {
    icon: Users,
    title: "Coaching that knows your name",
    body: "Every Member trains with coaches who track their progress and adjust their plan as they go.",
  },
  {
    icon: Trophy,
    title: "A community that shows up",
    body: "The people around you in class are often the biggest reason you keep coming back.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-white/10 py-16 lg:py-24">
        <div className="container-x max-w-3xl">
          <h1 className="font-display text-5xl lg:text-6xl text-ivory">Our Story</h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Jiggy Athletic Club started with a simple idea: most people don&apos;t fail at fitness
            because they lack willpower — they fail because they never had a real plan or anyone in
            their corner. We built a gym around coaching first, equipment second, and community
            running through everything.
          </p>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            Today we&apos;re home to hundreds of Members training across strength, conditioning,
            boxing, and everything in between, guided by coaches who've spent years learning how to
            get people real results.
          </p>
        </div>
      </section>

      <section className="container-x py-16 lg:py-24">
        <h2 className="font-display text-4xl text-ivory mb-10">What we stand for</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="border border-white/10 bg-surface rounded-soft p-7">
                <Icon className="w-7 h-7 text-violet mb-4" strokeWidth={1.75} />
                <h3 className="font-display text-xl text-ivory mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
