import Link from "next/link";
import { api } from "@/lib/api";
import { Coach } from "@/types";

export const metadata = { title: "Coaches" };

async function getCoaches(): Promise<Coach[]> {
  try {
    return await api.get<Coach[]>("/api/coaches");
  } catch {
    return [];
  }
}

export default async function CoachesPage() {
  const coaches = await getCoaches();

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl lg:text-6xl text-ivory">Our Coaches</h1>
        <p className="mt-4 text-lg text-muted">
          Certified professionals who build your program and stay in your corner while you work it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((c) => (
          <Link
            key={c.id}
            href={`/coaches/${c.id}`}
            className="group rounded-soft border border-white/10 bg-surface overflow-hidden hover:border-volt/50 transition-colors"
          >
            <div className="h-64 bg-cover bg-center bg-surface-2" style={{ backgroundImage: `url(${c.photoUrl})` }} />
            <div className="p-6">
              <h3 className="font-display text-xl text-ivory">{c.firstName} {c.lastName}</h3>
              <p className="text-sm text-violet mt-1">{c.title}</p>
              <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-2">{c.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
