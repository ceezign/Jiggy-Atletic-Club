import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, BarChart3, Users, ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Activity } from "@/types";

async function getActivity(slug: string): Promise<Activity | null> {
  try {
    return await api.get<Activity>(`/api/activities/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export default async function ActivityDetailPage({ params }: { params: { slug: string } }) {
  const activity = await getActivity(params.slug);
  if (!activity) notFound();

  return (
    <div>
      <div
        className="h-72 lg:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${activity.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-charcoal/20" />
      </div>
      <div className="container-x -mt-20 relative pb-20">
        <div className="max-w-3xl bg-surface border border-white/10 rounded-soft p-8 lg:p-10">
          <h1 className="font-display text-4xl lg:text-5xl text-ivory mb-5">{activity.name}</h1>
          <div className="flex flex-wrap gap-5 mb-6 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-violet" /> {activity.typicalDurationMinutes} minutes</span>
            <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-violet" /> {activity.difficultyLevel.replace("_", " ")}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-violet" /> {activity.suitableFor}</span>
          </div>
          <p className="text-ivory/85 leading-relaxed text-lg">{activity.description}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/free-trial" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors">
              Try it free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/classes" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/25 text-ivory font-semibold rounded-sharp hover:border-volt hover:text-volt transition-colors">
              See class times
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
