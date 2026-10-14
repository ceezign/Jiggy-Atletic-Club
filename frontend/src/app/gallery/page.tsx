import { api } from "@/lib/api";

export const metadata = { title: "Gallery" };

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
}

async function getImages(): Promise<GalleryImage[]> {
  try {
    return await api.get<GalleryImage[]>("/api/gallery");
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getImages();

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl lg:text-6xl text-ivory">Gallery</h1>
        <p className="mt-4 text-lg text-muted">A look inside Jiggy Athletic Club.</p>
      </div>

      {images.length === 0 ? (
        <p className="text-muted">No photos yet. Check back soon.</p>
      ) : (
        <div className="columns-2 md:columns-3 gap-4 [&>figure]:mb-4">
          {images.map((img) => (
            <figure key={img.id} className="break-inside-avoid rounded-soft overflow-hidden border border-white/10 bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.caption || "Gym photo"} loading="lazy" className="w-full h-auto block" />
              {img.caption && <figcaption className="px-4 py-3 text-xs text-muted">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
