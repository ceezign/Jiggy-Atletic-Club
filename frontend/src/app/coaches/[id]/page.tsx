import { notFound } from "next/navigation";
import Link from "next/link";
import { Instagram, Award, ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Coach } from "@/types";

async function getCoach(id: string): Promise<Coach | null> {
  try {
    return await api.get<Coach>(`/api/coaches/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export default async function CoachDetailPage({ params }: { params: { id: string } }) {
  const coach = await getCoach(params.id);
  if (!coach) notFound();

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="rounded-soft overflow-hidden border border-white/10">
            <div className="h-96 bg-cover bg-center bg-surface" style={{ backgroundImage: `url(${coach.photoUrl})` }} />
          </div>
          {coach.instagramUrl && (
            <a href={coach.instagramUrl} className="mt-4 inline-flex items-center gap-2 text-sm text-muted hover:text-volt">
              <Instagram className="w-4 h-4" /> Follow on Instagram
            </a>
          )}
        </div>
        <div className="lg:col-span-3">
          <h1 className="font-display text-4xl lg:text-5xl text-ivory">{coach.firstName} {coach.lastName}</h1>
          <p className="text-violet font-medium mt-2">{coach.title} · {coach.yearsExperience} years experience</p>
          <p className="mt-6 text-ivory/85 leading-relaxed text-lg">{coach.bio}</p>

          <div className="mt-8">
            <h3 className="font-display text-lg text-ivory mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {coach.specialties.map((s) => (
                <span key={s} className="px-3 py-1.5 text-xs font-medium bg-surface border border-white/10 rounded-sharp text-ivory/85">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-lg text-ivory mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-violet" /> Certifications
            </h3>
            <ul className="text-sm text-muted space-y-1.5">
              {coach.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <Link href="/free-trial" className="mt-9 inline-flex items-center gap-2 px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors">
            Train with {coach.firstName} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
