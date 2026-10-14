import ScheduleTable from "@/components/ScheduleTable";

export const metadata = { title: "Class Schedule" };

export default function ClassesPage() {
  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl lg:text-6xl text-ivory">Class Schedule</h1>
        <p className="mt-4 text-lg text-muted">
          Browse the weekly schedule and book straight into any class with spots remaining.
        </p>
      </div>
      <ScheduleTable />
    </div>
  );
}
